function generateBookCardContent(book) {
	// Returns the book card content of a given book object
	const bookGenre = book.genre.toLowerCase();

	return `
    <div class="card-info-div">
        <h3>${book.title}</h3>
        <div>by ${book.author}</div>
        <div>Genre: ${myLibrary.settings.genres[bookGenre].name}</div>
        <div>Pages: ${book.pages}</div>
        <div>My Rating: ${book.rating}</div>
    </div>
    <div class="card-buttons-div">
        <div class="read-button-div">
            <button class="read-button ${
				book.read ? 'read' : 'unread'
			}" onClick="myLibrary.toggleRead(${book.bookId})">${
		book.read ? 'Read' : 'Unread'
	}</button>
        </div>
        <div class="control-buttons-div">
            <button class="edit-button" onClick="myLibrary.editBook(${
				book.bookId
			})">Edit</button>
            <button class="delete-button" onClick="myLibrary.removeBook(${
				book.bookId
			})">Delete</button>
        </div>
    </div>`;
}

export default generateBookCardContent;
