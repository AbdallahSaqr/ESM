from django.db import models
from django.core.validators import MinValueValidator

class Company(models.Model):
    name = models.CharField(
        max_length=200,
        unique=True,
        help_text='Company name'
    )
    number_of_departments = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Automatically calculated number of departments'
    )
    number_of_employees = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Automatically calculated number of employees'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def update_counts(self):
        """Update the counts of departments and employees"""
        from departments.models import Department
        from employees.models import Employee
        
        self.number_of_departments = Department.objects.filter(company=self).count()
        self.number_of_employees = Employee.objects.filter(company=self).count()

    def save(self, *args, **kwargs):
        # Check if this is a new instance or an update
        is_new = self.pk is None
        
        # First save to ensure the instance has a primary key
        super().save(*args, **kwargs)
        
        # Only update counts if this is a new instance or if we're not already updating specific fields
        if is_new or kwargs.get('update_fields') is None:
            # Update counts in memory
            self.update_counts()
            # Save the counts using update_fields to avoid recursion
            super().save(update_fields=['number_of_departments', 'number_of_employees'])

    def delete(self, *args, **kwargs):
        # Store company info before deletion for cleanup
        company_id = self.pk
        super().delete(*args, **kwargs)
        
        # Note: We don't need to update counts after deletion since the company is gone
        # But if we need to update other related models, we could do it here
