#!/bin/bash

echo "🚀 Employee Management System - Getting Started"
echo "================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created!"
else
    echo "✅ Virtual environment already exists!"
fi

# Check if requirements are installed
if [ ! -f "venv/pyvenv.cfg" ]; then
    echo "❌ Virtual environment not properly created. Please run: python3 -m venv venv"
    exit 1
fi

echo ""
echo "🔧 Backend Setup:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Install dependencies: pip install -r requirements.txt"
echo "3. Run migrations: python manage.py migrate"
echo "4. Create superuser (optional): python manage.py createsuperuser"
echo "5. Start backend: python manage.py runserver"
echo ""

echo "🎨 Frontend Setup:"
echo "1. Navigate to frontend: cd frontend"
echo "2. Install dependencies: npm install"
echo "3. Start frontend: npm run dev"
echo ""

echo "🌐 Access Points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000/api/"
echo "- API Documentation: http://localhost:8000/api/docs/"
echo "- Admin Panel: http://localhost:8000/admin/"
echo ""

echo "📚 Quick Start:"
echo "1. Start both servers (use ./start_development.sh for convenience)"
echo "2. Visit http://localhost:8000/api/docs/ for detailed API documentation"
echo "3. Register a user at http://localhost:8000/api/auth/register/"
echo "4. Login to get your JWT token"
echo "5. Use the token to access protected endpoints"
echo ""

echo "🔐 Authentication Example:"
echo "curl -X POST http://localhost:8000/api/auth/register/ \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"user@example.com\",\"password\":\"password123\",\"first_name\":\"John\",\"last_name\":\"Doe\"}'"
echo ""

echo "💡 Tips:"
echo "- Use the startup script: ./start_development.sh"
echo "- Check the README.md for detailed instructions"
echo "- Visit /api/docs/ for interactive API documentation"
echo "- Use Postman or curl to test API endpoints"
echo ""

echo "🎯 Ready to get started? Run: ./start_development.sh"
