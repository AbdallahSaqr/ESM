from django.urls import path
from .views.department_views import (
    DepartmentListView, DepartmentDetailView,
    department_statistics, company_departments
)

urlpatterns = [
    # Department CRUD endpoints
    path('', DepartmentListView.as_view(), name='department-list'),
    path('<int:pk>/', DepartmentDetailView.as_view(), name='department-detail'),
    
    # Department utility endpoints
    path('statistics/', department_statistics, name='department-statistics'),
    path('companies/<int:company_id>/departments/', company_departments, name='company-departments'),
]
