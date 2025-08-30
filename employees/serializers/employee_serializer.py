from rest_framework import serializers
from ..models import Employee
from companies.serializers.company_serializer import CompanyListSerializer
from departments.serializers.department_serializer import DepartmentListSerializer

class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'company', 'company_name', 'department', 'department_name',
            'employee_status', 'name', 'email', 'mobile_number', 'address',
            'designation', 'hired_on', 'days_employed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'days_employed', 'created_at', 'updated_at']

class EmployeeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating employees"""
    class Meta:
        model = Employee
        fields = [
            'company', 'department', 'employee_status', 'name', 'email',
            'mobile_number', 'address', 'designation', 'hired_on'
        ]

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating employees"""
    class Meta:
        model = Employee
        fields = [
            'employee_status', 'name', 'email', 'mobile_number', 'address',
            'designation', 'hired_on'
        ]

class EmployeeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for employee lists"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'company_name', 'department_name', 'employee_status',
            'name', 'email', 'designation', 'hired_on', 'days_employed'
        ]

class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for employee views"""
    company = CompanyListSerializer(read_only=True)
    department = DepartmentListSerializer(read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'company', 'department', 'employee_status', 'name', 'email',
            'mobile_number', 'address', 'designation', 'hired_on', 'days_employed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'days_employed', 'created_at', 'updated_at']

class EmployeeStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating employee status"""
    employee_status = serializers.ChoiceField(choices=Employee.EMPLOYEE_STATUS_CHOICES)
    
    def validate_employee_status(self, value):
        """Validate status transition"""
        instance = self.context.get('instance')
        if instance and not instance.can_transition_to(value):
            raise serializers.ValidationError(
                f"Cannot transition from {instance.employee_status} to {value}"
            )
        return value
