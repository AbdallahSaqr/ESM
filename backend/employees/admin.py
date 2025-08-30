from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'department', 'employee_status', 'designation', 'hired_on', 'days_employed')
    list_filter = ('company', 'department', 'employee_status', 'hired_on')
    search_fields = ('name', 'email', 'company__name', 'department__name')
    ordering = ('company', 'department', 'name')
    readonly_fields = ('days_employed', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'email', 'mobile_number', 'address', 'designation')}),
        ('Company Details', {'fields': ('company', 'department')}),
        ('Status & Employment', {'fields': ('employee_status', 'hired_on', 'days_employed')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('company', 'department')
