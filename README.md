# Book Management System

A full-stack application for managing a collection of books, built with Node.js, Express, and vanilla JavaScript.

Screenshot (28).png
*Screenshot of the Book Management System interface*

## Features

- RESTful API for book management
- Responsive frontend interface
- Search functionality
- Pagination
- CRUD operations (Create, Read, Update, Delete)
- Form validation
- Toast notifications
- Confirmation dialogs

## Setup

1. Install dependencies:
```
npm install
```

2. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

The application will run on http://localhost:3000

## Frontend

The frontend is a responsive single-page application that allows users to:

- View all books with pagination
- Search for books by title, author, or genre
- Add new books
- Edit existing books
- Delete books with confirmation

## API Endpoints

### GET /books
- Returns all books with pagination
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Number of books per page (default: 10)
  - `search`: Search term to filter books by title, author, or genre

Example:
```
GET /books?page=1&limit=5&search=fiction
```

### GET /books/:id
- Returns a specific book by ID

### POST /books
- Creates a new book
- Request body should contain:
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Fiction",
    "publishedYear": 2023
  }
  ```
- Only `title` and `author` are required fields

### PUT /books/:id
- Updates a book by ID
- Request body should contain at least one of:
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author",
    "genre": "Updated Genre",
    "publishedYear": 2024
  }
  ```

### DELETE /books/:id
- Deletes a book by ID

## Project Structure

```
/
├── models/
│   └── books.js         # Book data model
├── public/              # Frontend files
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS styles
│   └── app.js           # Frontend JavaScript
├── routes/
│   └── books.js         # Book routes
├── server.js            # Main application file
└── package.json         # Project dependencies
```

## Testing the API with Postman

1. Open Postman
2. Create requests for each endpoint:
   - GET http://localhost:3000/books
   - GET http://localhost:3000/books?page=1&limit=2
   - GET http://localhost:3000/books?search=fiction
   - GET http://localhost:3000/books/1
   - POST http://localhost:3000/books (with JSON body)
   - PUT http://localhost:3000/books/1 (with JSON body)
   - DELETE http://localhost:3000/books/1

