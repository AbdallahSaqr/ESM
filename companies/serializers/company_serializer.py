from rest_framework import serializers
from ..models import Company

class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company model"""
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'number_of_departments', 'number_of_employees',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'number_of_departments', 'number_of_employees', 'created_at', 'updated_at']

class CompanyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating companies"""
    class Meta:
        model = Company
        fields = ['name']

class CompanyUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating companies"""
    class Meta:
        model = Company
        fields = ['name']

class CompanyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for company lists"""
    class Meta:
        model = Company
        fields = ['id', 'name', 'number_of_departments', 'number_of_employees']

class CompanyDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for company views"""
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'number_of_departments', 'number_of_employees',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'number_of_departments', 'number_of_employees', 'created_at', 'updated_at']
