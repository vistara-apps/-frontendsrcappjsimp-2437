# Modern Dashboard Application

A comprehensive business intelligence dashboard built with React and Node.js, providing real-time analytics, KPI monitoring, and transaction management capabilities.

![Dashboard Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Modern+Dashboard+Application)

## 🚀 Features

- **🔐 Secure Authentication** - JWT-based authentication with role-based access control
- **📊 Real-time Analytics** - Interactive charts and KPI monitoring
- **💳 Transaction Management** - Comprehensive transaction tracking with filtering and search
- **👥 User Management** - Admin panel for user administration
- **📱 Mobile Responsive** - Mobile-first design that works on all devices
- **🔒 Security First** - Rate limiting, CORS protection, and security headers
- **⚡ High Performance** - Optimized for speed and scalability

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern React with Hooks
- **Vite 5.4.1** - Fast build tool and dev server
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Chart.js 4.4.0** - Interactive data visualization
- **Axios 1.6.0** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js 16+** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet.js** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/-frontendsrcappjsimp-2437.git
cd -frontendsrcappjsimp-2437
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Environment Setup

Create environment files:

```bash
# Backend environment
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## 🔑 Demo Credentials

- **Admin User:** `admin` / `password`
- **Regular User:** `user` / `password`

## 📚 API Documentation

Comprehensive API documentation is available at [docs/API.md](docs/API.md).

### Key Endpoints

- `POST /login` - User authentication
- `GET /kpis` - Key performance indicators
- `GET /sales` - Sales data with filtering
- `GET /transactions` - Transaction management
- `GET /analytics/overview` - Analytics overview
- `GET /users` - User management (admin only)

## 🏗️ Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── LoginForm.jsx   # Authentication form
│   │   ├── KPICards.jsx    # KPI display cards
│   │   ├── SalesChart.jsx  # Sales visualization
│   │   └── ...
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── backend/               # Backend source code
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment template
├── docs/                  # Documentation
│   ├── API.md            # API documentation
│   └── PRD.md            # Product requirements
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Frontend Docker image
└── README.md             # This file
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### Individual Docker Builds

**Frontend:**
```bash
docker build -t dashboard-frontend .
docker run -p 3000:3000 dashboard-frontend
```

**Backend:**
```bash
cd backend
docker build -t dashboard-backend .
docker run -p 5000:5000 dashboard-backend
```

## 🧪 Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Run All Tests
```bash
npm run test:all
```

## 🔧 Development

### Code Quality

```bash
# Lint frontend code
npm run lint

# Lint backend code
cd backend && npm run lint

# Fix linting issues
npm run lint:fix
cd backend && npm run lint:fix
```

### Build for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 📊 Features Overview

### Dashboard Components

1. **KPI Cards** - Display key metrics like total sales, active customers, and daily revenue
2. **Sales Chart** - Interactive line chart showing sales trends over time
3. **Transaction Table** - Paginated table with filtering and search capabilities
4. **Quick Stats** - Additional metrics like conversion rate and customer retention

### Security Features

- JWT-based authentication with 24-hour token expiration
- Password hashing with bcrypt
- Rate limiting (100 requests/15min general, 5 requests/15min auth)
- CORS protection
- Security headers with Helmet.js
- Input validation and sanitization

### Performance Optimizations

- Code splitting and lazy loading
- Optimized bundle size with Vite
- Responsive images and assets
- Efficient API caching strategies
- Mobile-first responsive design

## 🌐 Production Deployment

### Environment Variables

Set the following environment variables in production:

```env
# Backend
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
PORT=5000

# Frontend
VITE_API_URL=https://api.your-domain.com
```

### Deployment Checklist

- [ ] Set secure JWT secret
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Test all functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](docs/API.md)
2. Review the [Product Requirements Document](docs/PRD.md)
3. Search existing issues on GitHub
4. Create a new issue with detailed information

## 🎯 Roadmap

### Upcoming Features

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] Export functionality (PDF/Excel)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced user permissions
- [ ] API rate limiting per user
- [ ] Real-time notifications
- [ ] Advanced filtering options

### Performance Improvements

- [ ] Redis caching layer
- [ ] CDN integration
- [ ] Database query optimization
- [ ] Progressive Web App (PWA) features
- [ ] Server-side rendering (SSR)

## 📈 Metrics and Analytics

The application tracks various metrics for performance monitoring:

- **User Engagement:** Login frequency, session duration
- **Performance:** Page load times, API response times
- **Business Metrics:** KPI trends, transaction volumes
- **System Health:** Error rates, uptime statistics

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with core dashboard functionality
- JWT authentication system
- Real-time KPI monitoring
- Transaction management
- Mobile-responsive design
- Docker deployment support

---

**Built with ❤️ by the Dashboard Team**

For more information, visit our [documentation](docs/) or contact the development team.
