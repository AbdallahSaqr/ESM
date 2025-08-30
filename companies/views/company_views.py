from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from ..models import Company
from ..serializers.company_serializer import (
    CompanySerializer, CompanyCreateSerializer, CompanyUpdateSerializer,
    CompanyListSerializer, CompanyDetailSerializer
)

class CompanyListView(generics.ListCreateAPIView):
    """List all companies or create a new one"""
    queryset = Company.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CompanyCreateSerializer
        return CompanyListSerializer
    
    def get_queryset(self):
        """Add filtering and search capabilities"""
        queryset = Company.objects.all()
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Filter by employee count
        min_employees = self.request.query_params.get('min_employees', None)
        if min_employees:
            queryset = queryset.filter(number_of_employees__gte=min_employees)
        
        # Filter by department count
        min_departments = self.request.query_params.get('min_departments', None)
        if min_departments:
            queryset = queryset.filter(number_of_departments__gte=min_departments)
        
        return queryset

class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a company"""
    queryset = Company.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CompanyUpdateSerializer
        return CompanyDetailSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def company_statistics(request):
    """Get company statistics"""
    total_companies = Company.objects.count()
    total_employees = sum(company.number_of_employees for company in Company.objects.all())
    total_departments = sum(company.number_of_departments for company in Company.objects.all())
    
    # Companies with most employees
    top_companies = Company.objects.order_by('-number_of_employees')[:5]
    
    # Companies with most departments
    top_departments = Company.objects.order_by('-number_of_departments')[:5]
    
    return Response({
        'total_companies': total_companies,
        'total_employees': total_employees,
        'total_departments': total_departments,
        'top_companies_by_employees': CompanyListSerializer(top_companies, many=True).data,
        'top_companies_by_departments': CompanyListSerializer(top_departments, many=True).data,
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def company_search(request):
    """Search companies by name"""
    query = request.query_params.get('q', '')
    if not query:
        return Response({'error': 'Query parameter "q" is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    companies = Company.objects.filter(name__icontains=query)
    return Response(CompanyListSerializer(companies, many=True).data)
