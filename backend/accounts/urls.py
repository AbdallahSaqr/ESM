from django.urls import path
from .views.auth_views import (
    UserRegistrationView, UserListView, UserDetailView,
    user_login, user_logout, user_profile, update_profile
)

urlpatterns = [
    # Authentication endpoints
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', user_login, name='user-login'),
    path('logout/', user_logout, name='user-logout'),
    path('profile/', user_profile, name='user-profile'),
    path('profile/update/', update_profile, name='user-profile-update'),
    
    # User management endpoints
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
