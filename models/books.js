// In-memory storage for books
let books = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', publishedYear: 1960 },
  { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopian', publishedYear: 1949 },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', publishedYear: 1925 }
];

// Get all books
const getAllBooks = () => {
  return books;
};

// Get total number of books
const getTotalBooks = () => {
  return books.length;
};

// Get paginated books
const getPaginatedBooks = (page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return books.slice(startIndex, endIndex);
};

// Get a book by ID
const getBookById = (id) => {
  return books.find(book => book.id === id);
};

// Add a new book
const addBook = (bookData) => {
  // Generate a new ID
  const id = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
  
  const newBook = { 
    id, 
    title: bookData.title, 
    author: bookData.author,
    genre: bookData.genre || null,
    publishedYear: bookData.publishedYear ? parseInt(bookData.publishedYear) : null
  };
  
  books.push(newBook);
  return newBook;
};

// Update a book
const updateBook = (id, bookData) => {
  const bookIndex = books.findIndex(book => book.id === id);
  
  if (bookIndex === -1) {
    return null;
  }
  
  // Update only the provided fields
  books[bookIndex] = {
    ...books[bookIndex],
    title: bookData.title || books[bookIndex].title,
    author: bookData.author || books[bookIndex].author,
    genre: bookData.genre !== undefined ? bookData.genre : books[bookIndex].genre,
    publishedYear: bookData.publishedYear !== undefined ? 
      (bookData.publishedYear ? parseInt(bookData.publishedYear) : null) : 
      books[bookIndex].publishedYear
  };
  
  return books[bookIndex];
};

// Delete a book
const deleteBook = (id) => {
  const bookIndex = books.findIndex(book => book.id === id);
  
  if (bookIndex === -1) {
    return null;
  }
  
  const deletedBook = books[bookIndex];
  books = books.filter(book => book.id !== id);
  
  return deletedBook;
};

// Search books by title or author
const searchBooks = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(term) || 
    book.author.toLowerCase().includes(term) ||
    (book.genre && book.genre.toLowerCase().includes(term))
  );
};

module.exports = {
  getAllBooks,
  getTotalBooks,
  getPaginatedBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks
};