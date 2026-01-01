#!/bin/bash

echo "🚀 Starting Vroom Local Development Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if Java is installed
if ! command -v java &> /dev/null; then
    print_error "Java is not installed. Please install Java 17 or higher."
    print_info "Install Java using:"
    print_info "  macOS: brew install openjdk@17"
    print_info "  Or download from: https://adoptium.net/"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    print_error "Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    print_info "Install Node.js using:"
    print_info "  macOS: brew install node"
    print_info "  Or download from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is running (optional - can use H2 for testing)
if ! command -v mysql &> /dev/null; then
    print_warning "MySQL is not installed. Using H2 in-memory database for development."
    print_info "To install MySQL: brew install mysql"
    USE_H2=true
else
    print_status "MySQL found. Checking if it's running..."
    if ! mysqladmin ping -h localhost --silent; then
        print_warning "MySQL is installed but not running. Using H2 in-memory database."
        print_info "To start MySQL: brew services start mysql"
        USE_H2=true
    else
        print_status "MySQL is running!"
        USE_H2=false
    fi
fi

print_status "Starting backend..."

# Navigate to backend directory
cd vehicle-rental-backend

# Create development properties for H2 if needed
if [ "$USE_H2" = true ]; then
    print_status "Creating H2 development configuration..."
    cat > src/main/resources/application-dev.properties << EOF
spring.application.name=vehicle-rental-backend

# H2 Database configuration
spring.datasource.url=jdbc:h2:mem:vehiclerental
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password

# H2 Console (for debugging)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Server configuration
server.port=8080

# Session Configuration
server.servlet.session.timeout=30m
server.servlet.session.cookie.name=VEHICLE_RENTAL_SESSION
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=false
server.servlet.session.cookie.same-site=lax

# CORS settings
spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
EOF
fi

# Start backend in background
print_status "Building and starting Spring Boot backend..."
if [ "$USE_H2" = true ]; then
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev > backend.log 2>&1 &
else
    ./mvnw spring-boot:run > backend.log 2>&1 &
fi
BACKEND_PID=$!

# Wait for backend to start
print_status "Waiting for backend to start..."
sleep 10

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_status "Backend started successfully! (PID: $BACKEND_PID)"
else
    print_error "Backend failed to start. Check backend.log for details."
    exit 1
fi

# Navigate to frontend directory
cd ../vehicle-rental-frontend

print_status "Installing frontend dependencies..."
npm install

print_status "Starting React development server..."
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

if ps -p $FRONTEND_PID > /dev/null; then
    print_status "Frontend started successfully! (PID: $FRONTEND_PID)"
else
    print_error "Frontend failed to start. Check frontend.log for details."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Vroom is now running locally!"
echo ""
echo "📊 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
if [ "$USE_H2" = true ]; then
    echo "   H2 Console: http://localhost:8080/h2-console"
    echo "   H2 JDBC URL: jdbc:h2:mem:vehiclerental"
fi
echo ""
echo "🔐 Default Login Credentials:"
echo "   Admin: admin@vroom.com / admin123"
echo "   User:  john@example.com / password123"
echo ""
echo "📝 Process Information:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop the application:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   Or press Ctrl+C to stop this script and then run:"
echo "   pkill -f 'spring-boot:run'"
echo "   pkill -f 'react-scripts'"
echo ""

# Keep script running and monitor processes
print_status "Monitoring application... Press Ctrl+C to stop."

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    print_status "Application stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Monitor processes
while true; do
    if ! ps -p $BACKEND_PID > /dev/null; then
        print_error "Backend process died unexpectedly!"
        kill $FRONTEND_PID 2>/dev/null
        exit 1
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        print_error "Frontend process died unexpectedly!"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    sleep 5
done