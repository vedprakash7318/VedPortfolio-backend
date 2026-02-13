const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/experience', require('./routes/experienceRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
