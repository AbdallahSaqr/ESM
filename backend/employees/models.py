from django.db import models
from django.core.validators import EmailValidator, RegexValidator
from companies.models import Company
from departments.models import Department
from django.utils import timezone
from datetime import date

class Employee(models.Model):
    EMPLOYEE_STATUS_CHOICES = [
        ('application_received', 'Application Received'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted'),
    ]
    
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='employees',
        help_text='Company this employee belongs to'
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='employees',
        help_text='Department this employee belongs to'
    )
    employee_status = models.CharField(
        max_length=25,
        choices=EMPLOYEE_STATUS_CHOICES,
        default='application_received',
        help_text='Current status in the onboarding workflow'
    )
    name = models.CharField(
        max_length=200,
        help_text='Employee full name'
    )
    email = models.EmailField(
        validators=[EmailValidator()],
        help_text='Employee email address'
    )
    mobile_number = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message='Phone number must be entered in the format: +999999999. Up to 15 digits allowed.'
            )
        ],
        help_text='Employee mobile number'
    )
    address = models.TextField(
        help_text='Employee address'
    )
    designation = models.CharField(
        max_length=200,
        help_text='Employee position/title'
    )
    hired_on = models.DateField(
        null=True,
        blank=True,
        help_text='Date when employee was hired (only if hired)'
    )
    days_employed = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Automatically calculated days employed (only if hired)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'
        ordering = ['company', 'department', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.department.name} ({self.company.name})"
    
    def clean(self):
        """Custom validation"""
        from django.core.exceptions import ValidationError
        
        # Ensure department belongs to the selected company
        if self.department and self.company:
            if self.department.company != self.company:
                raise ValidationError({
                    'department': 'Department must belong to the selected company.'
                })
        
        # Ensure hired_on is set when status is 'hired'
        if self.employee_status == 'hired' and not self.hired_on:
            raise ValidationError({
                'hired_on': 'Hired date must be set when employee status is "Hired".'
            })
    
    def save(self, *args, **kwargs):
        # Update days employed if hired
        if self.employee_status == 'hired' and self.hired_on:
            today = date.today()
            self.days_employed = (today - self.hired_on).days
        
        # Ensure clean validation passes
        self.full_clean()
        
        # Check if this is a new instance or an update
        is_new = self.pk is None
        
        # First save to ensure the instance has a primary key
        super().save(*args, **kwargs)
        
        # Only update counts if this is a new instance or if we're not already updating specific fields
        if is_new or kwargs.get('update_fields') is None:
            # Update department and company counts
            self.department.update_employee_count()
            self.department.save(update_fields=['number_of_employees'])
            self.company.update_counts()
            self.company.save(update_fields=['number_of_departments', 'number_of_employees'])
    
    def delete(self, *args, **kwargs):
        # Store references before deletion
        department = self.department
        company = self.company
        
        # Delete the employee
        super().delete(*args, **kwargs)
        
        # Update counts after deletion
        department.update_employee_count()
        department.save(update_fields=['number_of_employees'])
        company.update_counts()
        company.save(update_fields=['number_of_departments', 'number_of_employees'])
    
    def can_transition_to(self, new_status):
        """Check if status transition is allowed"""
        allowed_transitions = {
            'application_received': ['interview_scheduled', 'not_accepted'],
            'interview_scheduled': ['hired', 'not_accepted'],
            'hired': [],  # No transitions from hired
            'not_accepted': [],  # No transitions from not accepted
        }
        return new_status in allowed_transitions.get(self.employee_status, [])
    
    def transition_status(self, new_status):
        """Transition employee status if allowed"""
        if self.can_transition_to(new_status):
            self.employee_status = new_status
            self.save()
            return True
        return False
