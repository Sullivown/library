import generateBookCardContent from '../templates/generateBookCardContent.js';

function cancelEdit(id) {
	// Cancels any changes made in the edit form and displays unedited book
	const card = document.querySelector(`[data-bookid='${id}']`);
	const book = myLibrary.books.find((element) => element.bookId === id);
	card.innerHTML = generateBookCardContent(book);
}

export default cancelEdit;
