// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// require('dotenv').config();

// // Import database connection
// const connectDB = require('./config/database');

// // Import routes
// const portfolioRoutes = require('./routes/portfolio');
// const contactRoutes = require('./routes/contact');
// const authRoutes = require('./routes/auth');

// // Connect to database
// connectDB();

// const app = express();

// // Trust proxy for Render
// app.set('trust proxy', 1);

// // Security middleware with Render-specific configuration
// app.use(helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             styleSrc: ["'self", "'unsafe-inline'", "https://fonts.googleapis.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com"],
//             imgSrc: ["'self'", "data:", "https:"],
//             scriptSrc: ["'self'"],
//         },
//     },
// }));

// // CORS configuration for production
// const corsOptions = {
//     origin: function (origin, callback) {
//         // Allow requests with no origin (mobile apps, etc.)
//         if (!origin) return callback(null, true);
        
//         const allowedOrigins = [
//             process.env.CLIENT_URL,
//             'http://localhost:3000',
//             'https://localhost:3000'
//         ].filter(Boolean);
        
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));

// // Logging middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// } else {
//     app.use(morgan('combined'));
// }

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Create uploads directory if it doesn't exist
// const fs = require('fs');
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API routes
// app.use('/api/portfolio', portfolioRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/auth', authRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Server is running',
//         timestamp: new Date(),
//         uptime: process.uptime(),
//         environment: process.env.NODE_ENV || 'development'
//     });
// });

// // Serve React app in production
// if (process.env.NODE_ENV === 'production') {
//     // Serve static files from React build
//     app.use(express.static(path.join(__dirname, '../client/build')));
    
//     // Handle React routing, return all requests to React app
//     app.get('*', (req, res) => {
//         // Skip API routes
//         if (req.path.startsWith('/api/')) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'API endpoint not found' 
//             });
//         }
        
//         res.sendFile(path.join(__dirname, '../client/build/index.html'));
//     });
// }

// // Global error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error Details:', {
//         message: err.message,
//         stack: err.stack,
//         url: req.url,
//         method: req.method,
//         timestamp: new Date().toISOString()
//     });
    
//     let error = { ...err };
//     error.message = err.message;

//     // Mongoose bad ObjectId
//     if (err.name === 'CastError') {
//         const message = 'Resource not found';
//         error = { message, statusCode: 404 };
//     }

//     // Mongoose duplicate key
//     if (err.code === 11000) {
//         const message = 'Duplicate field value entered';
//         error = { message, statusCode: 400 };
//     }

//     // Mongoose validation error
//     if (err.name === 'ValidationError') {
//         const message = Object.values(err.errors).map(val => val.message);
//         error = { message, statusCode: 400 };
//     }

//     res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || 'Server Error',
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//     });
// });

// // Handle 404 for API routes
// app.use('/api/*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'API endpoint not found'
//     });
// });

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
//     console.log(`Health check available at: http://localhost:${PORT}/api/health`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//     console.log('Unhandled Promise Rejection:', err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//     console.log('Uncaught Exception:', err.message);
//     process.exit(1);
// });

// module.exports = app;



const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

// Connect to database
connectDB();

const app = express();

// Trust proxy for Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
}));

// CORS configuration - IMPORTANT: Add your frontend URL here
const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
        'http://localhost:3000',
        'https://localhost:3000',
        /\.onrender\.com$/  // Allow all Render subdomains
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Server is running',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            portfolio: '/api/portfolio',
            contact: '/api/contact',
            auth: '/api/auth'
        }
    });
});

// Handle 404 for API routes only
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// For non-API routes, return a simple message instead of trying to serve React files
app.get('*', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API Server is running',
        note: 'This is the backend API. Please access the frontend application at the frontend URL.',
        api_docs: '/api'
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Details:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`API documentation at: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err.message);
    process.exit(1);
});

module.exports = app;
