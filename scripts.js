// Constructors
function Library() {
    // Tracks books currently in the library
    this.books = [];

    // Refreshes the shelf display
    this.refreshDisplay = function() {
        shelf.innerHTML = '';

        this.books.forEach((book) => {
            createBookCard(book);
        })
    };

    // Adds book to the library and adds it to the shelf
    this.addBook = function(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        myLibrary.books.push(newBook);
        createBookCard(newBook);
    };

    // Toggle read status of book
    this.toggleRead = function(id) {
        this.books[id].read = !this.books[id].read;
        const readButton = document.querySelector(`[data-bookid='${id}'] .read-button`);
        if (this.books[id].read) {
            readButton.classList.remove('unread');
            readButton.classList.add('read');
            readButton.textContent = 'Read';
        } else {
            readButton.classList.remove('read');
            readButton.classList.add('unread');
            readButton.textContent = 'Unread';
        }
    }

    // Removes book from the library and removes it from the shelf
    this.removeBook = function(id) {
        this.books.splice(id, 1);
        this.refreshDisplay();
    };
}

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Create the library
let myLibrary = new Library();

// Selectors
const shelf = document.querySelector('.library-shelf');
const addNewButton = document.querySelector('#add-new-book');
const body = document.querySelector('body');
const header = document.querySelector('header');

// Add book button handler
addNewButton.addEventListener('click', () => {
    if (addNewButton.textContent === 'Add New Book') {
        let addBookBanner = document.createElement('div');
        addBookBanner.classList.add('addBookBanner');
        addBookBanner.innerHTML = `
            <input type="text" id="title" name="title" placeholder="Title">
            <input type="text" id="author" name="author" placeholder="Author">
            <input type="number" id="pages" name="pages" placeholder="Total Pages">
            <div>
                <label for="read">Read?</label><input type="checkbox" id="read" name="read">
            </div>
            <button id="submit-new-book">Add Book</button>
            `;

        body.insertBefore(addBookBanner, header.nextSibling);
        addNewButton.textContent = 'Close'

        document.querySelector('#submit-new-book').addEventListener('click', () => {
            const title = document.querySelector('#title');
            const author = document.querySelector('#author');
            const pages = document.querySelector('#pages');
            const read = document.querySelector('#read');
            myLibrary.addBook(title.value, author.value, pages.value, read.checked);

            // Reset input values
            title.value = '';
            author.value = '';
            pages.value = '';
            read.checked = false;
        })
    } else {
        document.querySelector('.addBookBanner').remove();
        addNewButton.textContent = 'Add New Book';
    }

})

// Creates and returns a book card to display in the library shelf area
function createBookCard(book) {
    let bookDiv = document.createElement('div');
            const bookId = myLibrary.books.indexOf(book)
            bookDiv.classList.add('book');
            bookDiv.dataset.bookid = bookId;
            bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <div>by ${book.author}</div>
            <div>Pages: ${book.pages}</div>
            <div class="card-buttons-div">
                <button class="read-button ${book.read ? 'read' : 'unread'}">${book.read ? 'Read' : 'Unread'}</button>
                <button class="delete-button">Delete</button>
            </div>`;

            shelf.append(bookDiv);

            // Add event listeners for buttons
            const delButton = document.querySelector(`[data-bookid='${bookId}'] .delete-button`);
            delButton.addEventListener('click', () => {
                myLibrary.removeBook(bookId);
            })

            const readButton = document.querySelector(`[data-bookid='${bookId}'] .read-button`);
            readButton.addEventListener('click', () => {
                myLibrary.toggleRead(bookId);
            })
}

// Function to populate the library with data for testing
function populateTestData(numOfBooks) {
    for (let i = 1; i <= numOfBooks; i++) {
        const testBook = new Book(`Title ${i}`, `Author ${i}`, i * 100, i % 3 === 0 ? false : true);
        myLibrary.books.push(testBook);
    }
}

// Initialize the library
document.addEventListener('DOMContentLoaded', () => {    
    populateTestData(5);
    myLibrary.refreshDisplay();
})
