# Employee Management System - API Documentation

## 📚 **Overview**

This document provides comprehensive API documentation for the Employee Management System. The API is built using Django REST Framework and follows RESTful principles with JWT authentication.

**Base URL**: `http://localhost:8000/api/`  
**API Documentation**: `http://localhost:8000/api/docs/`  
**API Root**: `http://localhost:8000/api/`

---

## 🔐 **Authentication**

### **JWT Token Authentication**

All API endpoints (except authentication endpoints) require a valid JWT access token in the Authorization header.

```http
Authorization: Bearer <access_token>
```

### **Token Management**

- **Access Token Lifetime**: 24 hours
- **Refresh Token Lifetime**: 7 days
- **Token Rotation**: Enabled (new refresh token with each refresh)
- **Token Blacklisting**: Enabled for security

---

## 📋 **API Endpoints Reference**

### **1. Authentication Endpoints**

#### **User Registration**
```http
POST /api/auth/register/
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "username": "user@example.com"
  }
}
```

**Validation Rules:**
- Email must be unique and valid format
- Password minimum 8 characters
- First and last names required

---

#### **User Login**
```http
POST /api/auth/login/
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "username": "user@example.com"
  }
}
```

---

#### **Token Refresh**
```http
POST /api/auth/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

#### **User Logout**
```http
POST /api/auth/logout/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

---

#### **Get User Profile**
```http
GET /api/auth/profile/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "username": "user@example.com",
  "date_joined": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-15T15:45:00Z"
}
```

---

#### **Update User Profile**
```http
PATCH /api/auth/profile/update/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "username": "user@example.com",
  "date_joined": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-15T15:45:00Z"
}
```

---

### **2. Company Endpoints**

#### **List Companies**
```http
GET /api/companies/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number for pagination (default: 1)
- `page_size`: Items per page (default: 20, max: 100)
- `search`: Search companies by name
- `ordering`: Sort by field (e.g., `name`, `-created_at`)

**Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "number_of_departments": 3,
      "number_of_employees": 25,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### **Create Company**
```http
POST /api/companies/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Tech Solutions Inc."
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Tech Solutions Inc.",
  "number_of_departments": 0,
  "number_of_employees": 0,
  "created_at": "2024-01-15T16:00:00Z",
  "updated_at": "2024-01-15T16:00:00Z"
}
```

**Validation Rules:**
- Company name is required and must be unique
- Maximum length: 200 characters

---

#### **Get Company Details**
```http
GET /api/companies/{id}/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
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

---

#### **Update Company**
```http
PUT /api/companies/{id}/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Acme Corporation Ltd."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Acme Corporation Ltd.",
  "number_of_departments": 3,
  "number_of_employees": 25,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T16:30:00Z"
}
```

---

#### **Delete Company**
```http
DELETE /api/companies/{id}/
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

**Note**: Deleting a company will also delete all associated departments and employees.

---

#### **Company Statistics**
```http
GET /api/companies/statistics/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_companies": 5,
  "total_departments": 15,
  "total_employees": 125,
  "average_employees_per_company": 25.0,
  "average_departments_per_company": 3.0
}
```

---

#### **Search Companies**
```http
GET /api/companies/search/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `q`: Search query string
- `page`: Page number for pagination

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "number_of_departments": 3,
      "number_of_employees": 25
    }
  ]
}
```

---

### **3. Department Endpoints**

#### **List Departments**
```http
GET /api/departments/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number for pagination
- `page_size`: Items per page
- `company`: Filter by company ID
- `search`: Search departments by name
- `ordering`: Sort by field

**Response (200 OK):**
```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Engineering",
      "company": 1,
      "company_name": "Acme Corporation",
      "number_of_employees": 15,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### **Create Department**
```http
POST /api/departments/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Marketing",
  "company": 1
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Marketing",
  "company": 1,
  "company_name": "Acme Corporation",
  "number_of_employees": 0,
  "created_at": "2024-01-15T16:00:00Z",
  "updated_at": "2024-01-15T16:00:00Z"
}
```

**Validation Rules:**
- Department name is required
- Company must exist and be valid
- Maximum name length: 200 characters

---

#### **Get Department Details**
```http
GET /api/departments/{id}/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Engineering",
  "company": 1,
  "company_name": "Acme Corporation",
  "number_of_employees": 15,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

#### **Update Department**
```http
PUT /api/departments/{id}/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Software Engineering",
  "company": 1
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Software Engineering",
  "company": 1,
  "company_name": "Acme Corporation",
  "number_of_employees": 15,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T16:30:00Z"
}
```

---

#### **Delete Department**
```http
DELETE /api/departments/{id}/
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

**Note**: Deleting a department will also delete all associated employees.

---

#### **Department Statistics**
```http
GET /api/departments/statistics/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_departments": 15,
  "total_employees": 125,
  "average_employees_per_department": 8.33,
  "largest_department": {
    "id": 1,
    "name": "Engineering",
    "company": "Acme Corporation",
    "employee_count": 25
  }
}
```

---

#### **Company Departments**
```http
GET /api/companies/{company_id}/departments/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Engineering",
      "number_of_employees": 15
    }
  ]
}
```

---

### **4. Employee Endpoints**

#### **List Employees**
```http
GET /api/employees/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number for pagination
- `page_size`: Items per page
- `company`: Filter by company ID
- `department`: Filter by department ID
- `status`: Filter by employee status
- `search`: Search employees by name or email
- `ordering`: Sort by field

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/employees/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@acme.com",
      "mobile_number": "+1234567890",
      "address": "123 Main St, City, State",
      "designation": "Software Engineer",
      "employee_status": "hired",
      "hired_on": "2024-01-15",
      "days_employed": 30,
      "company": 1,
      "company_name": "Acme Corporation",
      "department": 1,
      "department_name": "Engineering",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### **Create Employee**
```http
POST /api/employees/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "company": 1,
  "department": 1,
  "name": "Jane Smith",
  "email": "jane.smith@acme.com",
  "mobile_number": "+1234567890",
  "address": "456 Oak Ave, City, State",
  "designation": "Product Manager",
  "employee_status": "hired",
  "hired_on": "2024-01-20"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane.smith@acme.com",
  "mobile_number": "+1234567890",
  "address": "456 Oak Ave, City, State",
  "designation": "Product Manager",
  "employee_status": "hired",
  "hired_on": "2024-01-20",
  "days_employed": 25,
  "company": 1,
  "company_name": "Acme Corporation",
  "department": 1,
  "department_name": "Engineering",
  "created_at": "2024-01-20T10:30:00Z",
  "updated_at": "2024-01-20T10:30:00Z"
}
```

**Validation Rules:**
- All fields are required
- Email must be unique and valid format
- Mobile number must match pattern: `^\+?1?\d{9,15}$`
- Company and department must exist
- If status is "hired", `hired_on` date is required
- Department must belong to the selected company

---

#### **Get Employee Details**
```http
GET /api/employees/{id}/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@acme.com",
  "mobile_number": "+1234567890",
  "address": "123 Main St, City, State",
  "designation": "Software Engineer",
  "employee_status": "hired",
  "hired_on": "2024-01-15",
  "days_employed": 30,
  "company": 1,
  "company_name": "Acme Corporation",
  "department": 1,
  "department_name": "Engineering",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

#### **Update Employee**
```http
PUT /api/employees/{id}/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "company": 1,
  "department": 1,
  "name": "John Doe",
  "email": "john.doe@acme.com",
  "mobile_number": "+1234567890",
  "address": "123 Main St, City, State",
  "designation": "Senior Software Engineer",
  "employee_status": "hired",
  "hired_on": "2024-01-15"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@acme.com",
  "mobile_number": "+1234567890",
  "address": "123 Main St, City, State",
  "designation": "Senior Software Engineer",
  "employee_status": "hired",
  "hired_on": "2024-01-15",
  "days_employed": 30,
  "company": 1,
  "company_name": "Acme Corporation",
  "department": 1,
  "department_name": "Engineering",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T16:30:00Z"
}
```

---

#### **Delete Employee**
```http
DELETE /api/employees/{id}/
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

#### **Update Employee Status**
```http
PATCH /api/employees/{id}/status/
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "employee_status": "interview_scheduled"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "employee_status": "interview_scheduled",
  "message": "Status updated successfully"
}
```

**Valid Status Transitions:**
- `application_received` → `interview_scheduled`, `not_accepted`
- `interview_scheduled` → `hired`, `not_accepted`
- `hired` → No transitions allowed
- `not_accepted` → No transitions allowed

---

#### **Employee Statistics**
```http
GET /api/employees/statistics/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_employees": 125,
  "status_distribution": {
    "application_received": 15,
    "interview_scheduled": 20,
    "hired": 80,
    "not_accepted": 10
  },
  "average_days_employed": 45.5,
  "recent_hires": 12
}
```

---

#### **Company Employees**
```http
GET /api/companies/{company_id}/employees/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@acme.com",
      "designation": "Software Engineer",
      "employee_status": "hired",
      "department_name": "Engineering"
    }
  ]
}
```

---

#### **Department Employees**
```http
GET /api/departments/{department_id}/employees/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@acme.com",
      "designation": "Software Engineer",
      "employee_status": "hired"
    }
  ]
}
```

---

### **5. User Management Endpoints**

#### **List Users**
```http
GET /api/users/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "username": "user@example.com",
      "date_joined": "2024-01-15T10:30:00Z",
      "last_login": "2024-01-15T15:45:00Z"
    }
  ]
}
```

---

#### **Get User Details**
```http
GET /api/users/{id}/
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "username": "user@example.com",
  "date_joined": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-15T15:45:00Z"
}
```

---

## 📊 **Response Formats**

### **Success Responses**

#### **Single Object Response**
```json
{
  "id": 1,
  "name": "Example",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### **List Response (Paginated)**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

### **Error Responses**

#### **Validation Error (400 Bad Request)**
```json
{
  "error": "Validation failed",
  "details": {
    "name": ["This field is required."],
    "email": ["Enter a valid email address."]
  }
}
```

#### **Authentication Error (401 Unauthorized)**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### **Permission Error (403 Forbidden)**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

#### **Not Found Error (404 Not Found)**
```json
{
  "detail": "Not found."
}
```

#### **Server Error (500 Internal Server Error)**
```json
{
  "detail": "Internal server error."
}
```

---

## 🔧 **Error Handling**

### **HTTP Status Codes**

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Request successful, no content returned
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### **Common Error Scenarios**

#### **Token Expired**
```json
{
  "detail": "Token is invalid or expired"
}
```

#### **Invalid Data Format**
```json
{
  "detail": "JSON parse error - Expecting property name enclosed in double quotes"
}
```

#### **Field Validation Errors**
```json
{
  "field_name": [
    "This field is required.",
    "Ensure this field has no more than 200 characters."
  ]
}
```

---

## 📝 **Usage Examples**

### **Complete Employee Creation Flow**

1. **Create Company**
```bash
curl -X POST http://localhost:8000/api/companies/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Tech Corp"}'
```

2. **Create Department**
```bash
curl -X POST http://localhost:8000/api/departments/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Engineering", "company": 1}'
```

3. **Create Employee**
```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company": 1,
    "department": 1,
    "name": "John Doe",
    "email": "john@techcorp.com",
    "mobile_number": "+1234567890",
    "address": "123 Tech St, City, State",
    "designation": "Software Engineer",
    "employee_status": "hired",
    "hired_on": "2024-01-15"
  }'
```

### **Bulk Operations**

#### **Get All Companies with Departments**
```bash
curl -X GET "http://localhost:8000/api/companies/?page_size=100" \
  -H "Authorization: Bearer <access_token>"
```

#### **Search Employees by Company**
```bash
curl -X GET "http://localhost:8000/api/employees/?company=1&status=hired" \
  -H "Authorization: Bearer <access_token>"
```

---

## 🚀 **Rate Limiting & Performance**

### **Rate Limits**
- **Authentication endpoints**: 100 requests per hour
- **CRUD endpoints**: 1000 requests per hour
- **Search endpoints**: 500 requests per hour

### **Performance Tips**
- Use pagination for large datasets
- Implement client-side caching with SWR
- Use specific field selection when possible
- Batch operations where applicable

---

## 🔒 **Security Considerations**

### **Token Security**
- Store tokens securely (localStorage with automatic cleanup)
- Implement token refresh logic
- Clear tokens on logout
- Handle token expiration gracefully

### **Data Validation**
- Always validate input on both client and server
- Sanitize user input
- Use parameterized queries (handled by Django ORM)
- Implement proper error handling

### **CORS Configuration**
- Restricted to trusted origins
- Credentials allowed for authenticated requests
- Proper headers configuration

---

## 📱 **Mobile & Frontend Integration**

### **React Integration with SWR**
```javascript
import useSWR from 'swr';

const { data, error, mutate } = useSWR(
  '/api/employees/',
  fetcher,
  { refreshInterval: 30000 }
);
```

### **Error Handling**
```javascript
if (error) {
  if (error.status === 401) {
    // Handle authentication error
    logout();
  } else if (error.status === 400) {
    // Handle validation error
    setErrors(error.details);
  }
}
```

---

## 🧪 **Testing the API**

### **Using curl**
```bash
# Test authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test protected endpoint
curl -X GET http://localhost:8000/api/companies/ \
  -H "Authorization: Bearer <access_token>"
```

### **Using Postman**
1. Import the API collection
2. Set environment variables
3. Use the authentication flow
4. Test all endpoints

### **Using Python requests**
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', {
    'email': 'user@example.com',
    'password': 'password123'
})

token = response.json()['access']

# Use token
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/companies/', headers=headers)
```

---

## 📚 **Additional Resources**

### **Interactive Documentation**
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **API Root**: `http://localhost:8000/api/`

### **Code Examples**
- Frontend components in `frontend/src/components/`
- API services in `frontend/src/services/`
- Backend views in `backend/*/views/`

### **Support**
- Check the main README.md for setup instructions
- Review Django and React documentation
- Check browser console for frontend errors
- Check Django logs for backend errors

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**API Version**: v1
