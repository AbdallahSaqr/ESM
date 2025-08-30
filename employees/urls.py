from django.urls import path
from .views.employee_views import (
    EmployeeListView, EmployeeDetailView,
    update_employee_status, employee_statistics,
    company_employees, department_employees
)

urlpatterns = [
    # Employee CRUD endpoints
    path('', EmployeeListView.as_view(), name='employee-list'),
    path('<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    
    # Employee utility endpoints
    path('<int:pk>/status/', update_employee_status, name='employee-status-update'),
    path('statistics/', employee_statistics, name='employee-statistics'),
    path('companies/<int:company_id>/employees/', company_employees, name='company-employees'),
    path('departments/<int:department_id>/employees/', department_employees, name='department-employees'),
]
