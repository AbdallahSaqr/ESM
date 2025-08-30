from django.contrib import admin
from .models import Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'number_of_employees', 'created_at')
    list_filter = ('company', 'created_at')
    search_fields = ('name', 'company__name')
    ordering = ('company', 'name')
    readonly_fields = ('number_of_employees', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('company', 'name')}),
        ('Statistics', {'fields': ('number_of_employees',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
