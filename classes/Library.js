import Book from './Book.js';
import generateBookCardContent from '../templates/generateBookCardContent.js';
import addEditBookCard from '../helpers/addEditBookCard.js';

import { saveBook, editBook as editBookFB, deleteBook } from '../scripts.js';

const shelf = document.querySelector('.library-shelf');

class Library {
	// Tracks books currently in the library
	constructor() {
		this.books = [];

		this.settings = {
			currentSort: 'default',
			genres: {
				other: {
					name: 'Other',
					color: '#000000',
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
			},
		};
	}

	// Creates and returns a book card to display in the library shelf area
	createBookCard = function (book) {
		// Create book card div
		let bookDiv = document.createElement('div');
		const bookId = this.books.indexOf(book);
		bookDiv.classList.add('book');
		bookDiv.dataset.bookid = book.bookId;

		// Create book card content
		bookDiv.innerHTML = generateBookCardContent(book);

		// Add genre colours
		const bookGenre = book.genre.toLowerCase();
		bookDiv.style.boxShadow = `inset 0 5px ${this.settings.genres[bookGenre].color}`;

		shelf.append(bookDiv);
	};

	// Refreshes the shelf display
	refreshDisplay = function () {
		shelf.innerHTML = '';

		this.books.forEach((book) => {
			this.createBookCard(book);
		});
	};

	// Adds book to the library and adds it to the shelf
	addBook = function ({ bookId, title, author, genre, pages, rating, read }) {
		const newBook = new Book(
			bookId || Math.floor(Math.random() * 100000),
			title,
			author,
			genre,
			pages,
			rating,
			read
		);
		this.books.push(newBook);
		const newBookPure = Object.assign({}, newBook);
		saveBook(newBookPure);
	};

	// Toggle read status of book
	toggleRead = function (id) {
		// update book object for Firebase entry
		let bookData = this.books.find((element) => element.bookId === id);
		bookData = { ...bookData, read: !bookData.read };

		// Update the books array in myLibrary
		this.books = this.books.map((book) => {
			if (book.bookId === id) {
				return new Book(
					book.bookId,
					book.title,
					book.author,
					book.genre,
					book.pages,
					book.rating,
					!book.read
				);
			} else {
				return book;
			}
		});

		const readButton = document.querySelector(
			`[data-bookid='${id}'] .read-button`
		);
		if (bookData.read) {
			readButton.classList.remove('unread');
			readButton.classList.add('read');
			readButton.textContent = 'Read';
		} else {
			readButton.classList.remove('read');
			readButton.classList.add('unread');
			readButton.textContent = 'Unread';
		}

		editBookFB(bookData);
	};

	// Edit book in the library
	editBook = function (id) {
		addEditBookCard(id);
	};

	// Removes book from the library and removes it from the shelf
	removeBook = function (id) {
		const book = this.books.find((element) => element.bookId === id);
		const newBooks = this.books.filter((element) => element.bookId !== id);
		this.books = newBooks;
		deleteBook(book);
		this.refreshDisplay();
	};
}

export default Library;
