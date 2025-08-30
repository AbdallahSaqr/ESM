from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from ..models import Employee
from ..serializers.employee_serializer import (
    EmployeeSerializer, EmployeeCreateSerializer, EmployeeUpdateSerializer,
    EmployeeListSerializer, EmployeeDetailSerializer, EmployeeStatusUpdateSerializer
)

class EmployeeListView(generics.ListCreateAPIView):
    """List all employees or create a new one"""
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EmployeeCreateSerializer
        return EmployeeListSerializer
    
    def get_queryset(self):
        """Add filtering and search capabilities"""
        queryset = Employee.objects.all()
        
        # Filter by company
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        # Filter by department
        department_id = self.request.query_params.get('department', None)
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(employee_status=status_filter)
        
        # Search by name or email
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(email__icontains=search)
            )
        
        # Filter by designation
        designation = self.request.query_params.get('designation', None)
        if designation:
            queryset = queryset.filter(designation__icontains=designation)
        
        return queryset

class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete an employee"""
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EmployeeUpdateSerializer
        return EmployeeDetailSerializer

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_employee_status(request, pk):
    """Update employee status with validation"""
    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = EmployeeStatusUpdateSerializer(
        data=request.data, 
        context={'instance': employee}
    )
    
    if serializer.is_valid():
        new_status = serializer.validated_data['employee_status']
        
        if employee.transition_status(new_status):
            return Response(EmployeeDetailSerializer(employee).data)
        else:
            return Response({
                'error': f'Cannot transition from {employee.employee_status} to {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def employee_statistics(request):
    """Get employee statistics"""
    total_employees = Employee.objects.count()
    
    # Employees by status
    employees_by_status = Employee.objects.values('employee_status').annotate(
        count=Count('id')
    ).order_by('employee_status')
    
    # Employees by company
    employees_by_company = Employee.objects.values('company__name').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Employees by department
    employees_by_department = Employee.objects.values('department__name').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Top designations
    top_designations = Employee.objects.values('designation').annotate(
        count=Count('id')
    ).order_by('-count')[:10]
    
    return Response({
        'total_employees': total_employees,
        'employees_by_status': list(employees_by_status),
        'employees_by_company': list(employees_by_company),
        'employees_by_department': list(employees_by_department),
        'top_designations': list(top_designations),
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def company_employees(request, company_id):
    """Get all employees for a specific company"""
    try:
        employees = Employee.objects.filter(company_id=company_id)
        return Response(EmployeeListSerializer(employees, many=True).data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def department_employees(request, department_id):
    """Get all employees for a specific department"""
    try:
        employees = Employee.objects.filter(department_id=department_id)
        return Response(EmployeeListSerializer(employees, many=True).data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
