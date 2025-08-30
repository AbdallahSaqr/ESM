from rest_framework import serializers
from ..models import Department
from companies.serializers.company_serializer import CompanyListSerializer

class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Department
        fields = [
            'id', 'company', 'company_name', 'name', 'number_of_employees',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'number_of_employees', 'created_at', 'updated_at']

class DepartmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating departments"""
    class Meta:
        model = Department
        fields = ['company', 'name']

class DepartmentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating departments"""
    class Meta:
        model = Department
        fields = ['name']

class DepartmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for department lists"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['id', 'company', 'company_name', 'name', 'number_of_employees']

class DepartmentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for department views"""
    company = CompanyListSerializer(read_only=True)
    
    class Meta:
        model = Department
        fields = [
            'id', 'company', 'name', 'number_of_employees',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'number_of_employees', 'created_at', 'updated_at']
