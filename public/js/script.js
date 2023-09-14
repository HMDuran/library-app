// Constructor function for creating Book objects
function Book (title, author, pages, read) {
    this.title  = title
    this.author = author
    this.pages  = pages
    this.read   = read
    this.info   = function () {
        return (`${this.title} ${this.author}, ${this.pages}, ${this.read}`)
    };
}

// DOM elements
const addBookBtn     = document.getElementById('add-book-btn');
const sortBooks      = document.getElementById('sort-btn');
const modal          = document.getElementById('modal');
const closeBtn       = document.getElementById('close-modal');
const submitBtn      = document.getElementById('submit-btn');
const titleInput     = document.getElementById('title');
const authorInput    = document.getElementById('author');
const pagesInput     = document.getElementById('pages');
const statusSelected = document.getElementById('status');
const bookTable      = document.getElementById('book-table');
const searchInput    = document.getElementById('search');
 
// State variables
let editedRowIndex = -1;
let isSorted       = JSON.parse(localStorage.getItem('isSorted')) || false;

// Book counts
let totalBooksCount   = 0;
let booksReadCount    = 0;
let booksNotReadCount = 0;

// Open the modal form
function openModal() {
    modal.classList.remove('hidden');
}

// Close the modal form
function closeModal() {
    modal.classList.add('hidden');
    clearForm();
}

// Handle form submission within the modal
modal.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title  = titleInput.value;
    const author = authorInput.value;
    const pages  = pagesInput.value;
    const status = statusSelected.value;

    if (editedRowIndex !== -1) {
        const newRow = bookTable.rows[editedRowIndex];
        const cells  = newRow.cells;
        
        cells[0].textContent = title;
        cells[1].textContent = author;
        cells[2].textContent = pages;
        cells[3].textContent = status;
        
        updateLocalStorage();
        closeModal();
    } else {
        const newBook = new Book(title, author, pages, status);
        const newRow = bookTable.insertRow();
    
        for (let i = 0; i < 4; i++) {
            const cell = newRow.insertCell(i);
            cell.textContent = i === 0 ? newBook.title : i === 1 ? newBook.author : i === 2 ? newBook.pages : newBook.read;
        }
        
        const actionsCell = newRow.insertCell(4);
        actionsCell.innerHTML = '<button class="edit-btn">Edit</button> <button class="remove-btn">Delete</button>';
        
        saveToLocalStorage(newBook);
        closeModal();
    }
});

// Event listener for "Add Book" button
addBookBtn.addEventListener('click', function() {
    openModal();
    clearForm();
    editedRowIndex = -1; 
});

// Event listener for "Add Book" button
closeBtn.addEventListener('click', closeModal)

// Event listener to handle book editing/removal
bookTable.addEventListener('click', function(event) {
    const { target } = event;
    const row    = target.closest('tr');
    
    if (target.classList.contains('edit-btn')) {
        openModal();
        editedRowIndex = row.rowIndex;
        populateFormWithRowData(row);
    } else if (target.classList.contains('remove-btn')) {
        searchInput.value = "";
        performSearch('');
        row.remove();
        deleteFromLocalStorage(row);
        localStorage.setItem('searchTerm', '');
    }
});

// Populate the form with data from a selected row
function populateFormWithRowData(row) {
    const cells          = row.cells;
    titleInput.value     = cells[0].textContent;
    authorInput.value    = cells[1].textContent;
    pagesInput.value     = cells[2].textContent;
    statusSelected.value = cells[3].textContent;
}

// Clear the form inputs and reset editedRowIndex
function clearForm() {
    titleInput.value     = "";
    authorInput.value    = "";
    pagesInput.value     = "";
    statusSelected.value = "";
    editedRowIndex       = -1;
}

// Function to save a new book to local storage
function saveToLocalStorage(book) {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];
    existingBooks.push(book);
    localStorage.setItem('books', JSON.stringify(existingBooks));
    updateCounts();
}

// Function to update local storage after editing a book
function updateLocalStorage() {
    const updatedBooks = Array.from(bookTable.rows).slice(1).map(row => ({
        title: row.cells[0].textContent,
        author: row.cells[1].textContent,
        pages: row.cells[2].textContent,
        read: row.cells[3].textContent
    }));

    localStorage.setItem('books', JSON.stringify(updatedBooks));
    updateCounts();
}

// Function to delete a book from local storage
function deleteFromLocalStorage(row) {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];
    const title = row.cells[0].textContent;
    const author = row.cells[1].textContent;
    const read = row.cells[3].textContent;

    const indexToDelete = existingBooks.findIndex(book => (
        book.title === title &&
        book.author === author &&
        book.read === read
    ));
    
    if (indexToDelete !== -1) {
        existingBooks.splice(indexToDelete, 1);
        localStorage.setItem('books', JSON.stringify(existingBooks));
    }
    
    localStorage.setItem('searchTerm', '');
    updateCounts();
    performSearch('');
}

// Function to recalculate and update book counts
function updateCounts() {
    const rows = Array.from(bookTable.rows).slice(1);
    totalBooksCount = rows.length;
    booksReadCount = rows.filter(row => row.cells[3].textContent === 'Read').length;
    booksNotReadCount = totalBooksCount - booksReadCount;

    // Update the HTML elements displaying the counts
    document.querySelector('.cards .number').textContent       = totalBooksCount;
    document.querySelectorAll('.cards .number')[1].textContent = booksReadCount;
    document.querySelectorAll('.cards .number')[2].textContent = booksNotReadCount;
}

// Load data from local storage when the page loads
function loadAndPopulateBooks() {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];
      
    if (isSorted) {
        existingBooks.sort((bookA, bookB) => bookA.title.localeCompare(bookB.title));
    }
    
    const searchTerm = localStorage.getItem('searchTerm') || '';

    const filteredBooks = existingBooks.filter(book => {
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        const pages = book.pages.toLowerCase();
        const status = book.read.toLowerCase();
 
        return (
            title.includes(searchTerm) ||
            author.includes(searchTerm) ||
             ages.includes(searchTerm) ||
            status.includes(searchTerm)
        );
    });
 
    populateTable(filteredBooks);
    updateCounts();
    initializeSearchFilter();
}

// Load and populate books from local storage when the page loads
loadAndPopulateBooks();

// Event listener for the "Sort" button
sortBooks.addEventListener('click', function() {
    toggleSort();
    loadAndPopulateBooks();
});

// Function to toggle sorting state
function toggleSort() {
    isSorted = !isSorted;
    localStorage.setItem('isSorted', JSON.stringify(isSorted));
    loadAndPopulateBooks();
}

// Function to populate table with data
function populateTable(data) {
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }

    data.forEach(book => {
        const newRow = bookTable.insertRow();
        newRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.read}</td>
            <td><button class="edit-btn">Edit</button> <button class="remove-btn">Delete</button></td>
        `;
    });
}

// Event listener for the input event
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    performSearch(searchTerm);
    localStorage.setItem('searchTerm', searchTerm);
});

// Event listener for the keydown event
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      const searchTerm = searchInput.value.toLowerCase();
      performSearch(searchTerm);
      localStorage.setItem('searchTerm', searchTerm);
    }
});

// Function to load and initialize the search filter
function initializeSearchFilter() {
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
        searchInput.value = storedSearchTerm;
        performSearch(storedSearchTerm);
    }
}

// Function to perform a search
function performSearch(searchTerm) {
    const storedSearchTerm = localStorage.getItem('searchTerm') || '';
    searchTerm = searchTerm || storedSearchTerm;

    const rows = Array.from(bookTable.rows).slice(1);
    rows.forEach((row) => {
        const shouldShow = Array.from(row.cells)
            .map(cell => cell.textContent.toLowerCase())
            .some(text => text.includes(searchTerm));
        row.style.display = shouldShow ? 'table-row' : 'none';
    });

    if (!searchTerm) {
        loadAndPopulateBooks();
    }
}