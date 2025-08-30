from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True, required=False)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'role', 'is_active', 'date_joined', 'password', 'password_confirm'
        ]
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
            'username': {'required': False}  # Make username optional
        }
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if 'password' in attrs and 'password_confirm' in attrs:
            if attrs['password'] != attrs['password_confirm']:
                raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def validate_password(self, value):
        """Validate password strength"""
        if value:
            validate_password(value)
        return value
    
    def create(self, validated_data):
        """Create user with hashed password"""
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        # Auto-generate username from email if not provided
        if 'username' not in validated_data or not validated_data['username']:
            email = validated_data.get('email', '')
            validated_data['username'] = email.split('@')[0]  # Use part before @ as username
        
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        """Update user with password handling"""
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class UserListSerializer(serializers.ModelSerializer):
    """Simplified serializer for user lists"""
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active']

class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for user views"""
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 
            'role', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
