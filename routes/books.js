const express = require('express');
const router = express.Router();

// Import the books model (we'll create this next)
const booksModel = require('../models/books');

// GET all books with optional pagination and search
router.get('/', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  // Convert page and limit to numbers
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (search) {
    const searchResults = booksModel.searchBooks(search);
    
    // Apply pagination to search results
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedResults = searchResults.slice(startIndex, endIndex);
    
    return res.json({
      total: searchResults.length,
      page: pageNum,
      limit: limitNum,
      data: paginatedResults
    });
  }
  
  // Get paginated books
  const paginatedBooks = booksModel.getPaginatedBooks(pageNum, limitNum);
  res.json({
    total: booksModel.getTotalBooks(),
    page: pageNum,
    limit: limitNum,
    data: paginatedBooks
  });
});

// GET a specific book by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = booksModel.getBookById(id);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json(book);
});

// POST a new book
router.post('/', (req, res) => {
  const { title, author, genre, publishedYear } = req.body;
  
  // Validation
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  
  const newBook = booksModel.addBook({ title, author, genre, publishedYear });
  res.status(201).json(newBook);
});

// PUT (update) a book
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, genre, publishedYear } = req.body;
  
  // Validation
  if (!title && !author && !genre && !publishedYear) {
    return res.status(400).json({ message: 'At least one field is required for update' });
  }
  
  const updatedBook = booksModel.updateBook(id, { title, author, genre, publishedYear });
  
  if (!updatedBook) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json(updatedBook);
});

// DELETE a book
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const result = booksModel.deleteBook(id);
  
  if (!result) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json({ message: 'Book deleted successfully', book: result });
});

module.exports = router;