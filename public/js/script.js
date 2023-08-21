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

// Add and Sort Button
const addBookBtn     = document.getElementById('add-book-btn');
const sortBooks      = document.getElementById('sort-btn');

// Form
const modal          = document.getElementById('modal');
const closeBtn       = document.getElementById('close-modal');
const submitBtn      = document.getElementById('submit-btn');

// Inputs
const titleInput     = document.getElementById('title');
const authorInput    = document.getElementById('author');
const pagesInput     = document.getElementById('pages');
const statusSelected = document.getElementById('status');

// Table
const bookTable      = document.getElementById('book-table');

 // Keep track of the row being edited
let editedRowIndex = -1;

// Track the current sorting state
let isSorted = JSON.parse(localStorage.getItem('isSorted')) || false;

// Initialize book counts
let totalBooksCount = 0;
let booksReadCount = 0;
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

     // Retrieve input values from the form
    const title  = titleInput.value;
    const author = authorInput.value;
    const pages  = pagesInput.value;
    const status = statusSelected.value;

    if (editedRowIndex !== -1) {
        // If editing an existing book
        const newRow = bookTable.rows[editedRowIndex];
        const cells  = newRow.cells;

        // Update cell values with edited data
        cells[0].textContent = title;
        cells[1].textContent = author;
        cells[2].textContent = pages;
        cells[3].textContent = status;

        // Update the data in local storage after editing
        updateLocalStorage();

        closeModal();
    } else {
         // If adding a new book
        const newBook = new Book(title, author, pages, status);

        // Insert a new row in the table
        const newRow      = bookTable.insertRow();
        const titleCell   = newRow.insertCell(0);
        const authorCell  = newRow.insertCell(1);
        const pagesCell   = newRow.insertCell(2);
        const statusCell  = newRow.insertCell(3);
        const actionsCell = newRow.insertCell(4);

        // Populate cells with book data
        titleCell.textContent  = newBook.title;
        authorCell.textContent = newBook.author;
        pagesCell.textContent  = newBook.pages;
        statusCell.textContent = newBook.read;
        actionsCell.innerHTML  = '<button class="edit-btn">Edit</button> <button class="remove-btn">Delete</button>';

        // Save the data to local storage after adding a new book
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
    const target = event.target;
    const row    = target.closest('tr');

    if (target.classList.contains('edit-btn')) {
        openModal();
        editedRowIndex = row.rowIndex;
        populateFormWithRowData(row);
    } else if (target.classList.contains('remove-btn')) {
        bookTable.deleteRow(row.rowIndex);
        deleteFromLocalStorage(row);
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
    const rows = Array.from(bookTable.rows).slice(1);
    const updatedBooks = rows.map(row => {
        return {
            title:  row.cells[0].textContent,
            author: row.cells[1].textContent,
            pages:  row.cells[2].textContent,
            read:   row.cells[3].textContent
        };
    });

    localStorage.setItem('books', JSON.stringify(updatedBooks));
    updateCounts();
}

// Function to delete a book from local storage
function deleteFromLocalStorage(row) {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];

    const rowIndex = row.rowIndex - 1;
    existingBooks.splice(rowIndex, 1);

    localStorage.setItem('books', JSON.stringify(existingBooks));
    updateCounts();
}

// Function to recalculate and update book counts
function updateCounts() {
    totalBooksCount = bookTable.rows.length - 1;
    booksReadCount = Array.from(bookTable.rows).slice(1).filter(row => row.cells[3].textContent === 'Read').length;
    booksNotReadCount = totalBooksCount - booksReadCount;

    // Update the HTML elements displaying the counts
    document.querySelector('.cards .number').textContent       = totalBooksCount;
    document.querySelectorAll('.cards .number')[1].textContent = booksReadCount;
    document.querySelectorAll('.cards .number')[2].textContent = booksNotReadCount;
}


// Load data from local storage when the page loads
function loadBooksFromLocalStorage() {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];

    // Clear existing rows from the table
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }

    // Sort the existingBooks array based on title
    existingBooks.sort((bookA, bookB) => {
        const titleA = bookA.title.toLowerCase();
        const titleB = bookB.title.toLowerCase();
        return titleA.localeCompare(titleB);
    });

    existingBooks.forEach(book => {
        const newRow      = bookTable.insertRow();
        const titleCell   = newRow.insertCell(0);
        const authorCell  = newRow.insertCell(1);
        const pagesCell   = newRow.insertCell(2);
        const statusCell  = newRow.insertCell(3);
        const actionsCell = newRow.insertCell(4);

        titleCell.textContent  = book.title;
        authorCell.textContent = book.author;
        pagesCell.textContent  = book.pages;
        statusCell.textContent = book.read;
        actionsCell.innerHTML  = '<button class="edit-btn">Edit</button> <button class="remove-btn">Delete</button>';
    });
}

// Load data from local storage when the page loads
loadBooksFromLocalStorage();

// Populate the table based on the initial sorting state
populateTable();

// Event listener for the "Sort" button
sortBooks.addEventListener('click', function() {
    toggleSort();
    populateTable();
});

// Function to toggle sorting state
function toggleSort() {
    isSorted = !isSorted; 
    localStorage.setItem('isSorted', JSON.stringify(isSorted));
}

// Function to load and sort data from local storage
function loadAndSortData() {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];

    // Sort the existingBooks array based on title
    existingBooks.sort((bookA, bookB) => {
        const titleA = bookA.title.toLowerCase();
        const titleB = bookB.title.toLowerCase();
        return titleA.localeCompare(titleB);
    });
}

// Initialize the counts and display them
updateCounts();

// Function to populate table with data
function populateTable() {
    // Clear existing rows from the table
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }

    const data = JSON.parse(localStorage.getItem('books')) || [];

    if (isSorted) {
        data.sort((bookA, bookB) => {
            const titleA = bookA.title.toLowerCase();
            const titleB = bookB.title.toLowerCase();
            return titleA.localeCompare(titleB);
        });
    }

    data.forEach(book => {
        const newRow      = bookTable.insertRow();
        const titleCell   = newRow.insertCell(0);
        const authorCell  = newRow.insertCell(1);
        const pagesCell   = newRow.insertCell(2);
        const statusCell  = newRow.insertCell(3);
        const actionsCell = newRow.insertCell(4);

        titleCell.textContent   = book.title;
        authorCell.textContent  = book.author;
        pagesCell.textContent   = book.pages;
        statusCell.textContent  = book.read;
        actionsCell.innerHTML   = '<button class="edit-btn">Edit</button> <button class="remove-btn">Delete</button>';
    });
}

// Sort the book list alphabetically by title
function sortBooksAlphabetically() {
    const rows       = Array.from(bookTable.rows).slice(1); 
    const sortedRows = rows.sort((rowA, rowB) => {
        const titleA = rowA.cells[0].textContent.toLowerCase();
        const titleB = rowB.cells[0].textContent.toLowerCase();
        return titleA.localeCompare(titleB);
    });

     // Remove existing rows from the table
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }

    // Append sorted rows back to the table
    sortedRows.forEach(row => {
        bookTable.appendChild(row);
    });
}