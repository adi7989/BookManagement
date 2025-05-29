// API URL
const API_URL = 'http://localhost:3000';

// State management
let currentPage = 1;
let booksPerPage = 6;
let totalBooks = 0;
let currentSearchTerm = '';
let bookToDelete = null;

// DOM Elements
const booksList = document.getElementById('booksList');
const addBookForm = document.getElementById('addBookForm');
const editBookForm = document.getElementById('editBookForm');
const editModal = document.getElementById('editModal');
const confirmModal = document.getElementById('confirmModal');
const closeModalBtn = document.querySelector('.close');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const toast = document.getElementById('toast');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    
    // Add book form submission
    addBookForm.addEventListener('submit', handleAddBook);
    
    // Edit book form submission
    editBookForm.addEventListener('submit', handleEditBook);
    
    // Close modal when clicking the X
    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        currentPage = 1;
        currentSearchTerm = searchInput.value.trim();
        loadBooks();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentPage = 1;
            currentSearchTerm = searchInput.value.trim();
            loadBooks();
        }
    });
    
    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadBooks();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const maxPages = Math.ceil(totalBooks / booksPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            loadBooks();
        }
    });
    
    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', () => {
        if (bookToDelete) {
            deleteBook(bookToDelete);
        }
    });
    
    cancelDeleteBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        bookToDelete = null;
    });
});

// Load books from API
async function loadBooks() {
    try {
        booksList.innerHTML = '<div class="loading">Loading books...</div>';
        
        let url = `${API_URL}/books?page=${currentPage}&limit=${booksPerPage}`;
        if (currentSearchTerm) {
            url += `&search=${encodeURIComponent(currentSearchTerm)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        totalBooks = data.total;
        updatePaginationControls();
        
        if (data.data.length === 0) {
            booksList.innerHTML = '<div class="loading">No books found</div>';
            return;
        }
        
        renderBooks(data.data);
    } catch (error) {
        console.error('Error loading books:', error);
        booksList.innerHTML = '<div class="loading">Error loading books. Please try again.</div>';
        showToast('Failed to load books', true);
    }
}

// Render books to the DOM
function renderBooks(books) {
    booksList.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        bookCard.innerHTML = `
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-author">by ${escapeHtml(book.author)}</div>
            <div class="book-details">
                ${book.genre ? `<div>Genre: ${escapeHtml(book.genre)}</div>` : ''}
                ${book.publishedYear ? `<div>Published: ${book.publishedYear}</div>` : ''}
            </div>
            <div class="book-actions">
                <button class="edit-btn" data-id="${book.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${book.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        booksList.appendChild(bookCard);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            bookToDelete = parseInt(btn.dataset.id);
            confirmModal.style.display = 'block';
        });
    });
}

// Update pagination controls
function updatePaginationControls() {
    const maxPages = Math.ceil(totalBooks / booksPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${maxPages || 1}`;
    
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= maxPages;
}

// Handle adding a new book
async function handleAddBook(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const publishedYear = document.getElementById('publishedYear').value.trim();
    
    if (!title || !author) {
        showToast('Title and author are required', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author,
                genre: genre || null,
                publishedYear: publishedYear || null
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        
        const result = await response.json();
        
        // Reset form
        addBookForm.reset();
        
        // Reload books
        loadBooks();
        
        showToast('Book added successfully');
    } catch (error) {
        console.error('Error adding book:', error);
        showToast('Failed to add book', true);
    }
}

// Open edit modal with book data
async function openEditModal(bookId) {
    try {
        const response = await fetch(`${API_URL}/books/${bookId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch book details');
        }
        
        const book = await response.json();
        
        // Populate form fields
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editGenre').value = book.genre || '';
        document.getElementById('editPublishedYear').value = book.publishedYear || '';
        
        // Show modal
        editModal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching book details:', error);
        showToast('Failed to load book details', true);
    }
}

// Handle editing a book
async function handleEditBook(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('editBookId').value;
    const title = document.getElementById('editTitle').value.trim();
    const author = document.getElementById('editAuthor').value.trim();
    const genre = document.getElementById('editGenre').value.trim();
    const publishedYear = document.getElementById('editPublishedYear').value.trim();
    
    if (!title || !author) {
        showToast('Title and author are required', true);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author,
                genre: genre || null,
                publishedYear: publishedYear || null
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update book');
        }
        
        // Close modal
        editModal.style.display = 'none';
        
        // Reload books
        loadBooks();
        
        showToast('Book updated successfully');
    } catch (error) {
        console.error('Error updating book:', error);
        showToast('Failed to update book', true);
    }
}

// Delete a book
async function deleteBook(bookId) {
    try {
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        
        // Close modal
        confirmModal.style.display = 'none';
        bookToDelete = null;
        
        // Reload books
        loadBooks();
        
        showToast('Book deleted successfully');
    } catch (error) {
        console.error('Error deleting book:', error);
        showToast('Failed to delete book', true);
    }
}

// Show toast notification
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = isError ? 'toast error show' : 'toast show';
    
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}