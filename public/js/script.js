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


let editedRowIndex = -1;
let isSorted = JSON.parse(localStorage.getItem('isSorted')) || false;
let totalBooksCount = 0;
let booksReadCount = 0;
let booksNotReadCount = 0;
const itemsPerPage = 10;
let currentPage = 1;

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
       
        const newRow      = bookTable.insertRow();
        const titleCell   = newRow.insertCell(0);
        const authorCell  = newRow.insertCell(1);
        const pagesCell   = newRow.insertCell(2);
        const statusCell  = newRow.insertCell(3);
        const actionsCell = newRow.insertCell(4);
       
        titleCell.textContent  = newBook.title;
        authorCell.textContent = newBook.author;
        pagesCell.textContent  = newBook.pages;
        statusCell.textContent = newBook.read;
        actionsCell.innerHTML  = '<button class="edit-btn">Edit</button> <button class="remove-btn">Delete</button>';
        
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

    document.querySelector('.cards .number').textContent       = totalBooksCount;
    document.querySelectorAll('.cards .number')[1].textContent = booksReadCount;
    document.querySelectorAll('.cards .number')[2].textContent = booksNotReadCount;
}


// Load data from local storage when the page loads
function loadBooksFromLocalStorage() {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];
   
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }
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
   
    existingBooks.sort((bookA, bookB) => {
        const titleA = bookA.title.toLowerCase();
        const titleB = bookB.title.toLowerCase();
        return titleA.localeCompare(titleB);
    });
}

function loadBooksFromLocalStorage() {
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];
   
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }
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

    // Check whether to display pagination controls
    const totalNumPages = Math.ceil(existingBooks.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    if (totalNumPages > 1) {
        pagination.style.display = 'flex'; // Show pagination controls
    } else {
        pagination.style.display = 'none'; // Hide pagination controls
    }
}

// Initialize the counts and display them
updateCounts();

populateTable(currentPage);

// Event listener for the "Next" button
document.getElementById('next-btn').addEventListener('click', function () {
    if (currentPage < Math.ceil(totalBooksCount / itemsPerPage)) {
        currentPage++;
        populateTable(currentPage);
    }
});

// Event listener for the "Previous" button
document.getElementById('prev-btn').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        populateTable(currentPage);
    }
});

// Sort the book list alphabetically by title
function sortBooksAlphabetically() {
    const rows       = Array.from(bookTable.rows).slice(1); 
    const sortedRows = rows.sort((rowA, rowB) => {
        const titleA = rowA.cells[0].textContent.toLowerCase();
        const titleB = rowB.cells[0].textContent.toLowerCase();
        return titleA.localeCompare(titleB);
    });
    while (bookTable.rows.length > 1) {
        bookTable.deleteRow(1);
    }
    sortedRows.forEach(row => {
        bookTable.appendChild(row);
    });
}