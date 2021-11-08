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
        addEditBookCard(id);
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
    if (addNewButton.textContent === 'Add New Book') {
        addEditBookCard();
    } else {
        document.querySelector('.addBookBanner').remove();
        addNewButton.textContent = 'Add New Book';
    }
})

// Creates and returns a book card to display in the library shelf area
function createBookCard(book) {

    // Create book card div
    let bookDiv = document.createElement('div');
    const bookId = myLibrary.books.indexOf(book)
    bookDiv.classList.add('book');
    bookDiv.dataset.bookid = bookId;

    // Create book card content
    bookDiv.innerHTML = generateBookCardContent(book);

    // Add genre colours
    bookDiv.style.boxShadow = `inset 0 5px ${myLibrary.settings.genres[book.genre].color}`

    shelf.append(bookDiv);
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
function generateGenreArray(id) {
    let genreOptionsArr = [];
    const isEdit = !isNaN(id);

    if (!isEdit) {
        genreOptionsArr.push('<option value="other">--Please choose a genre--</option>');
    }

    for (const property in myLibrary.settings.genres) {
        if (isEdit && myLibrary.books[id].genre == property) {
            genreOptionsArr.push(`<option value="${property}" selected>${myLibrary.settings.genres[property].name}</option>`);
        } else {
            genreOptionsArr.push(`<option value="${property}">${myLibrary.settings.genres[property].name}</option>`);
        }
    };
    
    return genreOptionsArr;
}

function addEditBookCard(id) {
    
    let innerHTML = generateAddEditBookForm(id);

    // Set the selector depending on Add new or Edit was clicked
    let selector = null;

    if (isNaN(id)) {
        // If no ID - Add new was clicked
        selector = document.createElement('div');
        selector.classList.add('addBookBanner');
        body.insertBefore(selector, header.nextSibling);
        selector.innerHTML = innerHTML;
        addNewButton.textContent = 'Close'
    } else {
        // Else Edit was clicked
        selector = document.querySelector(`[data-bookid='${id}']`);
        selector.innerHTML = innerHTML;
    }

    selector.querySelector('.save-book').addEventListener('click', () => {
        const title = selector.querySelector('[name="title"]');
        const author = selector.querySelector('[name="author"]');
        const genre = selector.querySelector('[name="genre"]');
        const pages = selector.querySelector('[name="pages"]');
        const read = selector.querySelector('[name="read"]');

        if (isNaN(id)) {
            myLibrary.addBook(title.value, author.value, genre.value, pages.value, read.checked);

            // Reset input values
            title.value = '';
            author.value = '';
            pages.value = '';
            read.checked = false;
        } else {
            const editBook = myLibrary.books[id];
            editBook.title = selector.querySelector(`[name="title"]`).value;
            editBook.author = selector.querySelector('[name="author"]').value;
            editBook.genre = selector.querySelector('[name="genre"]').value;
            editBook.pages = selector.querySelector('[name="pages"]').value;
            editBook.read = selector.querySelector('[name="read"]').checked;

            selector.innerHTML = generateBookCardContent(myLibrary.books[id]);
        }
    })
}

function generateBookCardContent(book) {
    // Returns the book card conent of a given book object
    const bookID = myLibrary.books.indexOf(book);

    return `
    <div class="card-info-div">
        <h3>${book.title}</h3>
        <div>by ${book.author}</div>
        <div>Genre: ${myLibrary.settings.genres[book.genre].name}</div>
        <div>Pages: ${book.pages}</div>
        <div>My Rating: ${book.rating}</div>
    </div>
    <div class="card-buttons-div">
        <div class="read-button-div">
            <button class="read-button ${book.read ? 'read' : 'unread'}" onClick="myLibrary.toggleRead(${bookID})">${book.read ? 'Read' : 'Unread'}</button>
        </div>
        <div class="control-buttons-div">
            <button class="edit-button" onClick="myLibrary.editBook(${bookID})">Edit</button>
            <button class="delete-button" onClick="myLibrary.removeBook(${bookID})">Delete</button>
        </div>
    </div>`;
}

function generateAddEditBookForm(id) {
    // Returns a blank or pre-filled form depending on whether or not an ID is passed to the function
    const isEdit = !isNaN(id);
    let genreOptionsArr = generateGenreArray(id);

    return `
    <input type="text" name="title" placeholder="Title" value="${isEdit ? myLibrary.books[id].title : ''}">
    <input type="text" name="author" placeholder="Author" value="${isEdit ? myLibrary.books[id].author : ''}">
    <select name="genre">
        ${genreOptionsArr.join('')}
    </select>
    <input type="number" name="pages" placeholder="Total Pages" value="${isEdit ? myLibrary.books[id].pages : ''}">
    <input type="number" name="rating" placeholder="My Rating" value="${isEdit ? myLibrary.books[id].rating : ''}">
    <div>
        <label for="read">Read?</label><input type="checkbox" name="read" ${!isEdit ? '' : myLibrary.books[id].read ? 'checked' : ''}>
    </div>
    <button class="save-book">Save</button>
    ${isEdit ? `<button id="cancel-edit" onClick="cancelEdit(${id})">Cancel</button>` : ''}
    `;
}

function cancelEdit(id) {
    // Cancels any changes made in the edit form and displays unedited book
    const card = document.querySelector(`[data-bookid='${id}']`);
    card.innerHTML = generateBookCardContent(myLibrary.books[id]);
}