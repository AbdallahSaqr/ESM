from django.urls import path
from .views.company_views import (
    CompanyListView, CompanyDetailView,
    company_statistics, company_search
)

urlpatterns = [
    # Company CRUD endpoints
    path('', CompanyListView.as_view(), name='company-list'),
    path('<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    
    # Company utility endpoints
    path('statistics/', company_statistics, name='company-statistics'),
    path('search/', company_search, name='company-search'),
]
