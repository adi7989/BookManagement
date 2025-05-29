const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Import routes
const booksRoutes = require('./routes/books');

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API root route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the Book Management API',
    endpoints: {
      books: '/books'
    }
  });
});

// Use book routes
app.use('/books', booksRoutes);

// Serve the frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});