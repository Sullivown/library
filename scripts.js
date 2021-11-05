// Constructors
function Library() {
    // Tracks books currently in the library
    this.books = [];

    this.settings = {
        currentSort: 'default',
        genres: {
            other: {
                name: 'Other',
                color: '#000000'
            },
            thriller: {
                name: 'Thriller',
                color: '#FFC300',
            },
            horror: {
                name: 'Horror',
                color: '#581845',
            },
            historical: {
                name: 'Historical',
                color: '#AF9793',
            },
        }
    }

    // Refreshes the shelf display
    this.refreshDisplay = function() {
        shelf.innerHTML = '';

        this.books.forEach((book) => {
            createBookCard(book);
        })
    };

    // Adds book to the library and adds it to the shelf
    this.addBook = function(title, author, genre, pages, read, rating) {
        const newBook = new Book(title, author, genre, pages, read, rating);
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

    // Edit book in the library
    this.editBook = function(id) {
        let bookCard = document.querySelector(`[data-bookid='${id}']`);
        bookCard.innerHTML = addEditBookCard(id);
    }

    // Removes book from the library and removes it from the shelf
    this.removeBook = function(id) {
        this.books.splice(id, 1);
        this.refreshDisplay();
    };
}

function Book(title, author, genre, pages, read, rating) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
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
    let genreOptionsArr = generateGenreArray();

    if (addNewButton.textContent === 'Add New Book') {
        let addBookBanner = document.createElement('div');
        addBookBanner.classList.add('addBookBanner');
        addBookBanner.innerHTML = addEditBookCard();

        body.insertBefore(addBookBanner, header.nextSibling);
        addNewButton.textContent = 'Close'

        addBookBanner.querySelector('.save-book').addEventListener('click', () => {
            const title = addBookBanner.querySelector('[name="title"]');
            const author = addBookBanner.querySelector('[name="author"]');
            const genre = addBookBanner.querySelector('[name="genre"]');
            const pages = addBookBanner.querySelector('[name="pages"]');
            const read = addBookBanner.querySelector('[name="read"]');
            myLibrary.addBook(title.value, author.value, genre.value, pages.value, read.checked);

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
            <div class="card-info-div">
                <h3>${book.title}</h3>
                <div>by ${book.author}</div>
                <div>Genre: ${myLibrary.settings.genres[book.genre].name}</div>
                <div>Pages: ${book.pages}</div>
                <div>My Rating: ${book.rating}</div>
            </div>
            <div class="card-buttons-div">
                <div class="read-button-div">
                    <button class="read-button ${book.read ? 'read' : 'unread'}">${book.read ? 'Read' : 'Unread'}</button>
                </div>
                <div class="control-buttons-div">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            </div>`;

            // Add genre colours
            bookDiv.style.boxShadow = `inset 0 5px ${myLibrary.settings.genres[book.genre].color}`

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

            const editButton = document.querySelector(`[data-bookid='${bookId}'] .edit-button`);
            editButton.addEventListener('click', () => {
                myLibrary.editBook(bookId);
            })
}

// Function to populate the library with data for testing
function populateTestData(numOfBooks) {
    for (let i = 1; i <= numOfBooks; i++) {
       myLibrary.addBook(`Title ${i}`, `Author ${i}`, `thriller`, i * 100, i % 3 === 0 ? false : true, 5);
    }
}

// Initialize the library
document.addEventListener('DOMContentLoaded', () => {    
    populateTestData(5);
    myLibrary.refreshDisplay();
})

// Helper functions
function generateGenreArray() {
    let genreOptionsArr = [];
    for (const property in myLibrary.settings.genres) {
        genreOptionsArr.push(`<option value="${property}">${myLibrary.settings.genres[property].name}</option>`);
    };
    
    return genreOptionsArr;
}

function addEditBookCard(id) {
    let genreOptionsArr = generateGenreArray();
    
    let innerHTML = `
        <input type="text" name="title" placeholder="Title" value="${id ? myLibrary.books[id].title : ''}">
        <input type="text" name="author" placeholder="Author" value="${id ? myLibrary.books[id].author : ''}">
        <select name="genre">
            <option value="other">--Please choose an genre--</option>
            ${genreOptionsArr}
        </select>
        <input type="number" name="pages" placeholder="Total Pages" value="${id ? myLibrary.books[id].pages : ''}">
        <input type="number" name="rating" placeholder="My Rating" value="${id ? myLibrary.books[id].rating : ''}">
        <div>
            <label for="read">Read?</label><input type="checkbox" name="read" ${!id ? '' : myLibrary.books[id].read ? 'checked' : ''}>
        </div>
        <button class="save-book">Save</button>
        ${id ? '<button id="cancel-edit">Cancel</button>' : ''}
        `;

    return innerHTML;
}