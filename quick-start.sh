#!/bin/bash

echo "🚀 Quick Start - Vroom Vehicle Rental System"
echo "=============================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 17+"
    echo "   macOS: brew install openjdk@17"
    exit 1
else
    echo "✅ Java found"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    echo "   macOS: brew install node"
    exit 1
else
    echo "✅ Node.js found"
fi

echo ""
echo "🔧 Starting services..."

# Start backend
echo "Starting backend (this may take a moment)..."
cd vehicle-rental-backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 15

# Start frontend
echo "Starting frontend..."
cd vehicle-rental-frontend
npm install --silent
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Starting up..."
echo ""
echo "📱 Application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo ""
echo "🔐 Login credentials:"
echo "   admin@vroom.com / admin123"
echo "   john@example.com / password123"
echo ""
echo "⚠️  Note: First startup may take 1-2 minutes"
echo ""
echo "🛑 To stop: Press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Monitor and keep alive
while true; do
    sleep 10
done