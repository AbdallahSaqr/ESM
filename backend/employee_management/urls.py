from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from django.template.loader import render_to_string

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API root endpoint providing information about available endpoints."""
    return Response({
        'message': 'Employee Management System API',
        'version': '1.0.0',
        'endpoints': {
            'authentication': {
                'login': '/api/auth/login/',
                'register': '/api/auth/register/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
                'profile_update': '/api/auth/profile/update/'
            },
            'users': {
                'list': '/api/users/',
                'detail': '/api/users/{id}/'
            },
            'companies': {
                'list': '/api/companies/',
                'detail': '/api/companies/{id}/',
                'statistics': '/api/companies/statistics/',
                'search': '/api/companies/search/'
            },
            'departments': {
                'list': '/api/departments/',
                'detail': '/api/departments/{id}/',
                'statistics': '/api/departments/statistics/',
                'company_departments': '/api/companies/{company_id}/departments/'
            },
            'employees': {
                'list': '/api/employees/',
                'detail': '/api/employees/{id}/',
                'status_update': '/api/employees/{id}/status/',
                'statistics': '/api/employees/statistics/',
                'company_employees': '/api/companies/{company_id}/employees/',
                'department_employees': '/api/departments/{department_id}/employees/'
            }
        },
        'documentation': '/api/docs/',
        'admin': '/admin/'
    }, status=status.HTTP_200_OK)

def api_docs(request):
    """API documentation page with detailed endpoint information."""
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Management System API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        h3 {
            color: #2c3e50;
            margin-top: 25px;
        }
        .endpoint {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-right: 10px;
        }
        .get { background: #28a745; color: white; }
        .post { background: #007bff; color: white; }
        .put { background: #ffc107; color: black; }
        .delete { background: #dc3545; color: white; }
        .patch { background: #6f42c1; color: white; }
        .url {
            font-family: 'Courier New', monospace;
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            color: #495057;
        }
        .description {
            margin-top: 10px;
            color: #6c757d;
        }
        .params {
            margin-top: 10px;
        }
        .param {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 8px;
            margin: 5px 0;
        }
        .response {
            margin-top: 10px;
        }
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        .auth-note {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
        .example {
            background: #e8f5e8;
            border: 1px solid #c3e6c3;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
        }
        .swagger-link {
            display: inline-block;
            background: #85ea2d;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .swagger-link:hover {
            background: #6bcb23;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Employee Management System API Documentation</h1>
        
        <div class="auth-note">
            <strong>🔐 Authentication:</strong> This API uses JWT (JSON Web Tokens) for authentication. 
            Most endpoints require a valid access token in the Authorization header: 
            <code>Authorization: Bearer &lt;your_token&gt;</code>
        </div>

        <h2>📚 Quick Start</h2>
        <ol>
            <li><strong>Register a user:</strong> <code>POST /api/auth/register/</code></li>
            <li><strong>Login:</strong> <code>POST /api/auth/login/</code></li>
            <li><strong>Use the access token:</strong> Include in Authorization header</li>
        </ol>

        <h2>🔐 Authentication Endpoints</h2>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="url">/api/auth/register/</span>
            <div class="description">Register a new user account</div>
            <div class="params">
                <strong>Request Body:</strong>
                <div class="param">
                    <code>email</code> (required): User's email address<br>
                    <code>password</code> (required): User's password<br>
                    <code>first_name</code> (required): User's first name<br>
                    <code>last_name</code> (required): User's last name<br>
                    <code>role</code> (optional): User role (admin, manager, employee)
                </div>
            </div>
            <div class="response">
                <strong>Response:</strong> User object with access and refresh tokens
            </div>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="url">/api/auth/login/</span>
            <div class="description">Authenticate user and get access token</div>
            <div class="params">
                <strong>Request Body:</strong>
                <div class="param">
                    <code>email</code> (required): User's email address<br>
                    <code>password</code> (required): User's password
                </div>
            </div>
            <div class="response">
                <strong>Response:</strong> Access token, refresh token, and user data
            </div>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="url">/api/auth/logout/</span>
            <div class="description">Logout user (invalidate refresh token)</div>
            <div class="params">
                <strong>Request Body:</strong>
                <div class="param">
                    <code>refresh_token</code> (required): User's refresh token
                </div>
            </div>
        </div>

        <h2>🏢 Company Endpoints</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api/companies/</span>
            <div class="description">List all companies (requires authentication)</div>
            <div class="response">
                <strong>Response:</strong> Paginated list of companies
            </div>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="url">/api/companies/</span>
            <div class="description">Create a new company (requires authentication)</div>
            <div class="params">
                <strong>Request Body:</strong>
                <div class="param">
                    <code>name</code> (required): Company name
                </div>
            </div>
        </div>

        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api/companies/statistics/</span>
            <div class="description">Get company statistics (requires authentication)</div>
            <div class="response">
                <strong>Response:</strong> Total companies, departments, and employees
            </div>
        </div>

        <h2>🏢 Department Endpoints</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api/departments/</span>
            <div class="description">List all departments (requires authentication)</div>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="url">/api/departments/</span>
            <div class="description">Create a new department (requires authentication)</div>
            <div class="params">
                <strong>Request Body:</strong>
                <div class="param">
                    <code>name</code> (required): Department name<br>
                    <code>company</code> (required): Company ID
                </div>
            </div>
        </div>

        <h2>👥 Employee Endpoints</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api/employees/</span>
            <div class="description">List all employees (requires authentication)</div>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="url">/api/employees/</span>
            <div class="description">Create a new employee (requires authentication)</div>
            <div class="params">
                <strong>Request Body:</strong>
                <div class="param">
                    <code>name</code> (required): Employee name<br>
                    <code>email</code> (required): Employee email<br>
                    <code>company</code> (required): Company ID<br>
                    <code>department</code> (required): Department ID<br>
                    <code>designation</code> (required): Job title<br>
                    <code>employee_status</code> (optional): Status (application_received, interview_scheduled, hired, not_accepted)
                </div>
            </div>
        </div>

        <div class="endpoint">
            <span class="method put">PUT</span>
            <span class="url">/api/employees/{id}/status/</span>
            <div class="description">Update employee status (requires authentication)</div>
        </div>

        <h2>📊 Example Usage</h2>
        
        <div class="example">
            <h4>Creating a Company:</h4>
            <div class="code-block">
curl -X POST http://localhost:8000/api/companies/ \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Acme Corporation"}'
            </div>
        </div>

        <div class="example">
            <h4>Getting Company Statistics:</h4>
            <div class="code-block">
curl -X GET http://localhost:8000/api/companies/statistics/ \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
            </div>
        </div>

        <h2>🔧 Development</h2>
        <p>This API is built with Django REST Framework and provides:</p>
        <ul>
            <li>JWT-based authentication</li>
            <li>Comprehensive CRUD operations</li>
            <li>Automatic data validation</li>
            <li>RESTful design principles</li>
            <li>Detailed error messages</li>
        </ul>

        <h2>📖 More Information</h2>
        <ul>
            <li><strong>Admin Panel:</strong> <a href="/admin/">/admin/</a> - Django admin interface</li>
            <li><strong>API Root:</strong> <a href="/api/">/api/</a> - API overview</li>
            <li><strong>Frontend:</strong> <a href="http://localhost:3000">http://localhost:3000</a> - React application</li>
        </ul>

        <div class="auth-note">
            <strong>💡 Tip:</strong> Use tools like Postman, Insomnia, or curl to test the API endpoints. 
            Remember to include the Authorization header with your JWT token for protected endpoints.
        </div>
    </div>
</body>
</html>
    """
    return HttpResponse(html_content, content_type='text/html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/docs/', api_docs, name='api-docs'),
    path('api/auth/', include('accounts.urls')),
    path('api/users/', include('accounts.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/departments/', include('departments.urls')),
    path('api/employees/', include('employees.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
