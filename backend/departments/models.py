from django.db import models
from django.core.validators import MinValueValidator
from companies.models import Company

class Department(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='departments',
        help_text='Company this department belongs to'
    )
    name = models.CharField(
        max_length=200,
        help_text='Department name'
    )
    number_of_employees = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Automatically calculated number of employees'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['company', 'name']
        unique_together = ['company', 'name']
    
    def __str__(self):
        return f"{self.company.name} - {self.name}"
    
    def update_employee_count(self):
        """Update the count of employees in this department"""
        from employees.models import Employee
        self.number_of_employees = Employee.objects.filter(department=self).count()

    def save(self, *args, **kwargs):
        # Check if this is a new instance or an update
        is_new = self.pk is None
        
        # First save to ensure the instance has a primary key
        super().save(*args, **kwargs)
        
        # Only update counts if this is a new instance or if we're not already updating specific fields
        if is_new or kwargs.get('update_fields') is None:
            # Update employee count in memory
            self.update_employee_count()
            # Save the count using update_fields to avoid recursion
            super().save(update_fields=['number_of_employees'])
            
            # Update company counts (this will call company.update_counts() which is now safe)
            self.company.update_counts()

    def delete(self, *args, **kwargs):
        # Store company reference before deletion
        company = self.company
        
        # Delete the department
        super().delete(*args, **kwargs)
        
        # Update company counts after deletion
        company.update_counts()
        company.save(update_fields=['number_of_departments', 'number_of_employees'])
