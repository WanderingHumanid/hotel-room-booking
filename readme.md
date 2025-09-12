# 🏨 Hotel Room Booking System

A full-stack web application for hotel room booking with a modern React frontend and Django REST API backend. The system allows users to search for hotels, view available rooms, make bookings, and manage their reservations.

## ✨ Features

- **Hotel Search & Browse**: Search and filter hotels by location, price, and availability
- **Room Management**: View detailed room information with images and pricing
- **User Authentication**: Secure guest registration and login system
- **Booking System**: Make, view, and manage hotel room reservations
- **Admin Interface**: Django admin panel for hotel and booking management
- **Responsive Design**: Mobile-friendly interface built with React
- **Image Gallery**: Hotel and room image galleries for better user experience

## 🛠️ Tech Stack

### Backend
- **Django 5.2.3** - Python web framework
- **Django REST Framework 3.15.2** - API development
- **MySQL** - Database (via mysqlclient 2.2.6)
- **Pillow 11.0.0** - Image processing
- **django-cors-headers 4.6.0** - Cross-origin resource sharing

### Frontend
- **React 19.1.0** - JavaScript library for user interfaces
- **Axios 1.10.0** - HTTP client for API requests
- **React Scripts 5.0.1** - Development tools and build system
- **CSS3** - Styling and responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+**
- **Node.js 14+** and npm
- **MySQL 5.7+** or **MySQL 8.0+**
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/WanderingHumanid/hotel-room-booking.git
cd hotel-room-booking
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Database Configuration
1. Create a MySQL database for the project
2. Update the database configuration in `hotelapi/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',
        'USER': 'your_mysql_username',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Start Backend Server
```bash
python manage.py runserver
```
The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node.js Dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm start
```
The frontend application will be available at `http://localhost:3000`


## 🔧 API Endpoints

The backend provides RESTful API endpoints:

- `GET /api/hotels/` - List all hotels
- `GET /api/hotels/{id}/` - Get hotel details
- `GET /api/rooms/` - List all rooms
- `POST /api/bookings/` - Create a new booking
- `GET /api/bookings/` - List user bookings
- `POST /api/guests/` - Register a new guest
- `POST /api/auth/login/` - User authentication

## 🎯 Usage

1. **Browse Hotels**: View available hotels with their details and images
2. **Search & Filter**: Use search functionality to find hotels by criteria
3. **Room Selection**: Browse rooms within selected hotels
4. **Guest Registration**: Create an account or login as existing user
5. **Make Booking**: Select dates and book available rooms
6. **View Bookings**: Check your booking history and details

## 🛠️ Development

### Database Management
```bash
# Clear database (custom management command)
python manage.py clear_db

# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### Building for Production
```bash
# Build frontend for production
cd frontend
npm run build
```

## Developed for SEP program organized by Christ College of Engineering, Irinjalakuda.

