# Employee Management System

A full-stack web application for managing employees, companies, and departments with role-based access control and comprehensive API endpoints.

## 🚀 **Project Overview**

This Employee Management System is built using **Django REST Framework** for the backend API and **React** with **Material-UI** for the frontend. The system provides a comprehensive solution for HR professionals to manage organizational structure, employee data, and workflow processes.

### **Key Features**
- **Company Management**: Create and manage multiple companies
- **Department Management**: Organize departments within companies
- **Employee Management**: Complete employee lifecycle management
- **Role-Based Access Control**: Secure authentication and authorization
- **Real-time Data**: SWR-powered data fetching with automatic revalidation
- **Responsive Design**: Mobile-friendly Material-UI interface
- **Comprehensive API**: RESTful endpoints with detailed documentation

## 🏗️ **Architecture & Implementation Details**

### **Backend Architecture (Django)**
- **Framework**: Django 5.2.5 with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Authentication**: JWT-based authentication with token refresh
- **API Design**: RESTful principles with proper HTTP status codes
- **Validation**: Comprehensive model validation with custom business logic
- **Pagination**: Built-in pagination for large datasets

### **Frontend Architecture (React)**
- **Framework**: React 18+ with functional components and hooks
- **State Management**: SWR for server state, React Context for auth state
- **UI Library**: Material-UI (MUI) for consistent design system
- **Routing**: React Router for SPA navigation
- **Data Fetching**: SWR with automatic revalidation and error handling
- **Form Handling**: Controlled components with real-time validation

### **Key Implementation Decisions**

#### **1. SWR Integration**
- **Why SWR**: Chosen over React Query for its simplicity and excellent integration with Django REST Framework
- **Implementation**: Global SWR configuration with custom hooks for authenticated requests
- **Benefits**: Automatic caching, revalidation, and error handling

#### **2. JWT Authentication**
- **Implementation**: `djangorestframework-simplejwt` with extended token lifetimes
- **Security**: Token blacklisting, rotation, and secure storage
- **UX**: Automatic token refresh and graceful error handling

#### **3. Model Relationships & Counts**
- **Challenge**: Maintaining accurate counts across related models (companies, departments, employees)
- **Solution**: Custom `save()` methods with `update_fields` to prevent recursion
- **Result**: Efficient updates without infinite loops

#### **4. Form Validation**
- **Frontend**: Real-time validation with immediate feedback
- **Backend**: Comprehensive model validation with business logic
- **Integration**: Seamless error handling between frontend and backend

## 📋 **Task Completion Checklist**

### ✅ **Core Functionality**
- [x] **User Authentication System**
  - User registration and login
  - JWT token management
  - Role-based access control
  - Secure logout and token cleanup

- [x] **Company Management**
  - Create, read, update, delete companies
  - Automatic employee and department count tracking
  - Validation and error handling

- [x] **Department Management**
  - Create, read, update, delete departments
  - Company association validation
  - Employee count tracking

- [x] **Employee Management**
  - Complete CRUD operations
  - Status workflow management (Application → Interview → Hired/Rejected)
  - Company and department association
  - Conditional field validation (hired_on date)

- [x] **Dashboard & Statistics**
  - Real-time counts and statistics
  - Responsive design with Material-UI
  - Conditional rendering based on authentication

### ✅ **Technical Implementation**
- [x] **Frontend-Backend Integration**
  - SWR-powered data fetching
  - Proper error handling and loading states
  - Form validation and submission

- [x] **Database Design**
  - Proper model relationships
  - Efficient count tracking
  - Data integrity constraints

- [x] **API Design**
  - RESTful endpoints
  - Proper HTTP status codes
  - Comprehensive error responses

- [x] **Security Implementation**
  - JWT authentication
  - CORS configuration
  - Input validation and sanitization

### ✅ **User Experience**
- [x] **Responsive Design**
  - Mobile-friendly interface
  - Material-UI components
  - Consistent design language

- [x] **Form Handling**
  - Real-time validation
  - Conditional field display
  - Clear error messages

- [x] **Data Management**
  - Automatic revalidation
  - Optimistic updates
  - Loading and error states

## 🔒 **Security Measures**

### **Authentication & Authorization**
- **JWT Tokens**: Secure, stateless authentication
- **Token Rotation**: Automatic refresh token rotation
- **Token Blacklisting**: Secure logout and token invalidation
- **Role-Based Access**: User-specific permissions and data access

### **Data Protection**
- **Input Validation**: Comprehensive frontend and backend validation
- **SQL Injection Prevention**: Django ORM with parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Django's built-in CSRF middleware

### **API Security**
- **CORS Configuration**: Restricted to trusted origins
- **Rate Limiting**: Built-in Django protection
- **Secure Headers**: Security middleware configuration
- **Input Sanitization**: Automatic data cleaning and validation

### **Token Security**
- **Extended Lifetimes**: 24-hour access tokens, 7-day refresh tokens
- **Secure Storage**: localStorage with automatic cleanup
- **Automatic Refresh**: Seamless token renewal
- **Graceful Degradation**: Proper error handling on token expiration

## 🚀 **Setup & Installation**

### **Prerequisites**
- **Python**: 3.8+ (3.12.3 recommended)
- **Node.js**: 18+ (22.18.0 recommended)
- **npm**: 9+ (10.2.4 recommended)
- **Git**: Latest version

### **Backend Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-management-system/backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the server**
   ```bash
   python manage.py runserver
   ```

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### **Quick Start Scripts**

Use the provided helper scripts for faster setup:

```bash
# Make scripts executable (one-time setup)
chmod +x start_development.sh
chmod +x get_started.sh

# Start both backend and frontend
./start_development.sh

# Or use individual scripts
./start_backend.sh
./start_frontend.sh
```

## 📚 **API Documentation**

### **Base URL**
```
http://localhost:8000/api/
```

### **Authentication Endpoints**

#### **User Registration**
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### **User Login**
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### **Company Endpoints**

#### **List Companies**
```http
GET /api/companies/
Authorization: Bearer <access_token>
```

#### **Create Company**
```http
POST /api/companies/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Acme Corporation"
}
```

#### **Company Statistics**
```http
GET /api/companies/statistics/
Authorization: Bearer <access_token>
```

### **Department Endpoints**

#### **List Departments**
```http
GET /api/departments/
Authorization: Bearer <access_token>
```

#### **Create Department**
```http
POST /api/departments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Engineering",
  "company": 1
}
```

### **Employee Endpoints**

#### **List Employees**
```http
GET /api/employees/
Authorization: Bearer <access_token>
```

#### **Create Employee**
```http
POST /api/employees/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "company": 1,
  "department": 1,
  "name": "Jane Smith",
  "email": "jane.smith@acme.com",
  "mobile_number": "+1234567890",
  "address": "123 Main St, City, State",
  "designation": "Software Engineer",
  "employee_status": "hired",
  "hired_on": "2024-01-15"
}
```

#### **Update Employee Status**
```http
PATCH /api/employees/{id}/status/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "employee_status": "interview_scheduled"
}
```

### **User Management Endpoints**

#### **User Profile**
```http
GET /api/auth/profile/
Authorization: Bearer <access_token>
```

#### **Update Profile**
```http
PATCH /api/auth/profile/update/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith"
}
```

### **Response Formats**

#### **Success Response**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "number_of_departments": 3,
  "number_of_employees": 25,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### **Error Response**
```json
{
  "error": "Validation failed",
  "details": {
    "name": ["This field is required."],
    "email": ["Enter a valid email address."]
  }
}
```

#### **Paginated Response**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/employees/?page=2",
  "previous": null,
  "results": [...]
}
```

## 🌐 **External API Documentation**

### **Interactive API Documentation**
Access the built-in API documentation at:
```
http://localhost:8000/api/docs/
```

### **API Root**
View all available endpoints at:
```
http://localhost:8000/api/
```

## 🧪 **Testing**

### **Backend Testing**
```bash
cd backend
python manage.py test
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

## 🚀 **Deployment**

### **Production Considerations**
- **Database**: Use PostgreSQL for production
- **Static Files**: Configure proper static file serving
- **Environment Variables**: Set `DEBUG=False` and configure `SECRET_KEY`
- **HTTPS**: Enable HTTPS in production
- **CORS**: Restrict CORS to production domains

### **Environment Variables**
```bash
DEBUG=False
SECRET_KEY=your-secure-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Token Authentication Errors**
- Clear browser localStorage and sessionStorage
- Check token expiration
- Verify backend server is running

#### **CORS Issues**
- Ensure backend CORS settings match frontend URL
- Check `CORS_ALLOWED_ORIGINS` configuration

#### **Database Errors**
- Run migrations: `python manage.py migrate`
- Check database connection
- Verify model relationships

#### **Frontend Build Issues**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are installed

### **Debug Mode**
Enable debug mode in Django settings for detailed error information:
```python
DEBUG = True
```

## 📝 **Development Notes**

### **Key Design Decisions**
1. **SWR over React Query**: Simpler integration with Django REST Framework
2. **JWT over Session**: Stateless authentication for scalability
3. **Material-UI**: Consistent design system and responsive components
4. **Custom Model Methods**: Efficient count tracking without recursion

### **Performance Considerations**
- **Database Indexing**: Proper indexing on frequently queried fields
- **Caching**: SWR provides automatic caching and revalidation
- **Pagination**: Built-in pagination for large datasets
- **Optimistic Updates**: Immediate UI feedback with background sync

### **Scalability Features**
- **Modular Architecture**: Separate apps for different entities
- **API Versioning**: Ready for future API versioning
- **Database Abstraction**: Easy to switch between database backends
- **Microservice Ready**: Can be split into separate services

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using Django, React, and Material-UI**
