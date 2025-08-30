from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'number_of_departments', 'number_of_employees', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name',)
    ordering = ('name',)
    readonly_fields = ('number_of_departments', 'number_of_employees', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('name',)}),
        ('Statistics', {'fields': ('number_of_departments', 'number_of_employees')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
