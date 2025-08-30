#!/bin/bash

echo "🚀 Starting Employee Management System Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    pkill -f "python manage.py runserver"
    pkill -f "npm run dev"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🔧 Starting Django backend server..."
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting React frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

echo ""
echo "✅ Development servers started successfully!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api/"
echo "   Admin Panel: http://localhost:8000/admin/"
echo ""
echo "📱 Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait
