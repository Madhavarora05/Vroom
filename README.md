# Vroom - Vehicle Rental System

A comprehensive vehicle rental management system built with Spring Boot backend and React frontend.

## 🚀 Features

### User Features
- **User Registration & Authentication**: Secure user registration and login
- **Vehicle Browsing**: Browse available vehicles with search and filter options
- **Real-time Availability**: Check vehicle availability for specific dates
- **Booking Management**: Make bookings and view booking history
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of bookings, users, and vehicles
- **Vehicle Management**: Add, edit, and manage vehicle models and units
- **User Management**: Manage user accounts and permissions
- **Booking Oversight**: Monitor all bookings across the system

### Technical Features
- **Session-based Authentication**: Secure session management
- **RESTful APIs**: Well-structured REST endpoints
- **Database Integration**: MySQL database with JPA/Hibernate
- **Containerized Deployment**: Docker and Docker Compose support
- **Production Ready**: Optimized for production deployment

## 🛠 Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.3**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**

### Frontend
- **React 19.1.0**
- **React Router DOM**
- **Bootstrap 5.3.7**
- **Axios**
- **Lucide React Icons**

### DevOps
- **Docker & Docker Compose**
- **Nginx**
- **Maven**
- **npm**

## 📋 Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vroom
```

### 2. Deploy with Docker
```bash
# Make deploy script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MySQL**: localhost:3306

### 4. Default Login Credentials
- **Admin**: admin@vroom.com / admin123
- **User**: john@example.com / password123

## 🛠 Manual Setup

### Backend Setup
```bash
cd vehicle-rental-backend

# Using Maven
./mvnw clean install
./mvnw spring-boot:run

# Or using Docker
docker build -t vroom-backend .
docker run -p 8080:8080 vroom-backend
```

### Frontend Setup
```bash
cd vehicle-rental-frontend

# Install dependencies
npm install

# Start development server
npm start

# Or build for production
npm run build
```

### Database Setup
```bash
# Start MySQL container
docker run --name vroom-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=vehiclerental -p 3306:3306 -d mysql:8.0
```

## 📁 Project Structure

```
vroom/
├── vehicle-rental-backend/          # Spring Boot backend
│   ├── src/main/java/com/vehicle/
│   │   ├── controller/              # REST controllers
│   │   ├── service/                 # Business logic
│   │   ├── model/                   # JPA entities
│   │   ├── repository/              # Data repositories
│   │   ├── config/                  # Configuration classes
│   │   └── dto/                     # Data transfer objects
│   ├── src/main/resources/
│   │   ├── application.properties   # Development config
│   │   └── application-prod.properties # Production config
│   ├── Dockerfile
│   └── pom.xml
├── vehicle-rental-frontend/         # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # React context
│   │   ├── api/                     # API configuration
│   │   └── App.js                   # Main app component
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml               # Multi-container setup
├── deploy.sh                        # Deployment script
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/profile` - Get user profile

### Vehicles
- `GET /api/users/car-models` - Get all car models
- `GET /api/users/available-units` - Get available units for dates

### Bookings
- `POST /api/users/book` - Create new booking
- `GET /api/users/my-bookings` - Get user's bookings

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/car-models` - Get all car models
- `POST /api/admin/car-models` - Add new car model

## 🧪 Sample Data

The application comes with pre-loaded sample data:

### Vehicles
- Maruti Suzuki Swift (Hatchback) - ₹1,800/day
- Hyundai Creta (SUV) - ₹3,500/day
- Honda City (Sedan) - ₹2,800/day
- Mahindra Thar (SUV) - ₹4,200/day
- Toyota Innova Crysta (MPV) - ₹4,800/day

### Users
- Admin: admin@vroom.com / admin123
- User: john@example.com / password123

## 🔧 Configuration

### Environment Variables

#### Backend
- `SPRING_DATASOURCE_URL` - Database URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `CORS_ALLOWED_ORIGINS` - CORS allowed origins

#### Frontend
- `REACT_APP_BACKEND_URL` - Backend API URL

## 🚀 Deployment

### Production Deployment
1. Update environment variables in `docker-compose.yml`
2. Set production database credentials
3. Configure CORS origins for your domain
4. Run `./deploy.sh`

### Cloud Deployment
- **AWS**: Use ECS or EKS with RDS for database
- **Google Cloud**: Use Cloud Run with Cloud SQL
- **Azure**: Use Container Instances with Azure Database

## 🧪 Testing

### Backend Testing
```bash
cd vehicle-rental-backend
./mvnw test
```

### Frontend Testing
```bash
cd vehicle-rental-frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials
   - Verify database exists

2. **CORS Issues**
   - Check CORS configuration in backend
   - Verify frontend URL in allowed origins

3. **Port Conflicts**
   - Change ports in docker-compose.yml
   - Ensure ports 3000, 8080, 3306 are available

4. **Build Failures**
   - Check Java version (requires Java 17)
   - Ensure Node.js version compatibility
   - Clear Maven/npm cache

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Happy Coding! 🚗💨**