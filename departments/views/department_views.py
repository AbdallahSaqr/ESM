from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from ..models import Department
from ..serializers.department_serializer import (
    DepartmentSerializer, DepartmentCreateSerializer, DepartmentUpdateSerializer,
    DepartmentListSerializer, DepartmentDetailSerializer
)

class DepartmentListView(generics.ListCreateAPIView):
    """List all departments or create a new one"""
    queryset = Department.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DepartmentCreateSerializer
        return DepartmentListSerializer
    
    def get_queryset(self):
        """Add filtering and search capabilities"""
        queryset = Department.objects.all()
        
        # Filter by company
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Filter by employee count
        min_employees = self.request.query_params.get('min_employees', None)
        if min_employees:
            queryset = queryset.filter(number_of_employees__gte=min_employees)
        
        return queryset

class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a department"""
    queryset = Department.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DepartmentUpdateSerializer
        return DepartmentDetailSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def department_statistics(request):
    """Get department statistics"""
    total_departments = Department.objects.count()
    total_employees = sum(dept.number_of_employees for dept in Department.objects.all())
    
    # Departments with most employees
    top_departments = Department.objects.order_by('-number_of_employees')[:10]
    
    # Departments by company
    departments_by_company = Department.objects.values('company__name').annotate(
        count=Count('id'),
        total_employees=Count('employees')
    ).order_by('-count')
    
    return Response({
        'total_departments': total_departments,
        'total_employees': total_employees,
        'top_departments_by_employees': DepartmentListSerializer(top_departments, many=True).data,
        'departments_by_company': list(departments_by_company),
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def company_departments(request, company_id):
    """Get all departments for a specific company"""
    try:
        departments = Department.objects.filter(company_id=company_id)
        return Response(DepartmentListSerializer(departments, many=True).data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
