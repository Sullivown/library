import generateBookCardContent from '../templates/generateBookCardContent.js';

function cancelEdit(id) {
	// Cancels any changes made in the edit form and displays unedited book
	const card = document.querySelector(`[data-bookid='${id}']`);
	card.innerHTML = generateBookCardContent(myLibrary.books[id]);
}

export default cancelEdit;
