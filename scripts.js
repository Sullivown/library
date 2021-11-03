let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);

    displayBooks();
}

// Selectors
const shelf = document.querySelector('.library-shelf');

// Loops through all books and displays them on the shelf
function displayBooks() {
    shelf.innerHTML = '';

    myLibrary.forEach((book, index) => {
        let bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.dataset.bookid = index;
        bookDiv.innerHTML = `
        <h3>${book.title}</h3>
        <p>by ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <p>${book.read ? 'Read' : 'Unread'}</p>`;

        shelf.append(bookDiv);

    })
}

// Function to populate the library with data for testing
function populateTestData(numOfBooks) {
    for (let i = 1; i <= numOfBooks; i++) {
        const testBook = new Book(`Title ${i}`, `Author ${i}`, i * 100, i % 3 === 0 ? false : true);
        myLibrary.push(testBook);
    }
}

// Initialize the library
document.addEventListener('DOMContentLoaded', () => {
    populateTestData(5);
    displayBooks();
})
