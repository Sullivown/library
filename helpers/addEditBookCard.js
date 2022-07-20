import generateAddEditBookForm from '../templates/generateAddEditBookForm.js';
import generateBookCardContent from '../templates/generateBookCardContent.js';
import cancelEdit from '../helpers/cancelEdit.js';

const body = document.querySelector('body');
const header = document.querySelector('header');
const addNewButton = document.querySelector('#add-new-book');

function addEditBookCard(id) {
	const book = myLibrary.books.find((element) => element.bookId === id);
	let innerHTML = generateAddEditBookForm(id);

	// Set the selector depending on Add new or Edit was clicked
	let selector = null;

	if (isNaN(id)) {
		// If no ID - Add new was clicked
		selector = document.createElement('div');
		selector.classList.add('addBookBanner');
		body.insertBefore(selector, header.nextSibling);
		selector.innerHTML = innerHTML;
		addNewButton.textContent = 'Close';
	} else {
		// Else Edit was clicked
		selector = document.querySelector(`[data-bookid='${book.bookId}']`);
		console.log(selector);
		selector.innerHTML = innerHTML;
		selector.querySelector('.cancel-edit').addEventListener('click', () => {
			cancelEdit(id);
		});
	}

	selector.querySelector('.save-book').addEventListener('click', () => {
		const form =
			id >= 0
				? document.querySelector(
						`[data-bookid="${book.bookId}"] > form`
				  )
				: document.querySelector('.addBookBanner > form');

		const title = selector.querySelector('[name="title"]');
		const author = selector.querySelector('[name="author"]');
		const genre = selector.querySelector('[name="genre"]');
		const pages = selector.querySelector('[name="pages"]');
		const read = selector.querySelector('[name="read"]');
		const rating = selector.querySelector('[name="rating"]');

		// Validation goes here??
		if (form.reportValidity()) {
			if (isNaN(id)) {
				myLibrary.addBook({
					title: title.value,
					author: author.value,
					genre: genre.value,
					pages: pages.value,
					rating: rating.value,
					read: read.checked,
				});

				// Reset input values
				title.value = '';
				author.value = '';
				pages.value = '';
				rating.value = '';
				read.checked = false;
			} else {
				const editBook = book;
				editBook.title = selector.querySelector(`[name="title"]`).value;
				editBook.author =
					selector.querySelector('[name="author"]').value;
				editBook.genre = selector.querySelector('[name="genre"]').value;
				editBook.pages = selector.querySelector('[name="pages"]').value;
				editBook.rating = selector.querySelector('[name="rating').value;
				editBook.read = selector.querySelector('[name="read"]').checked;

				selector.innerHTML = generateBookCardContent(book);
			}

			// Update local storage
			localStorage.setItem('books', JSON.stringify(myLibrary.books));
		}
	});
}

export default addEditBookCard;
