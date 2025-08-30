from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.db import models
from django.core.validators import EmailValidator

class User(AbstractUser):
    objects = CustomUserManager()
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
    
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        help_text='Email address used as login ID'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='employee',
        help_text='User role in the system'
    )
    
    # Override username to use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']
    
    class Meta:
        verbose_name = 'User Account'
        verbose_name_plural = 'User Accounts'
    
    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_manager(self):
        return self.role == 'manager'
    
    def is_employee(self):
        return self.role == 'employee'
