// Temp
/**
function Book (title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.info = function () {
        return (`${this.title} ${this.author}, ${this.pages}, ${this.read}`)
    }
}

const theHobbit = new Book('The Hobbit', 'by J.R.R. Tolkien', '295 pages', 'not read yet')
console.log(theHobbit.info());

 */

const addBookBtn = document.getElementById('add-book-btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-modal');

function openModal() {
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

addBookBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal)

