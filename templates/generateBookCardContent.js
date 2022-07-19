function generateBookCardContent(book) {
	// Returns the book card content of a given book object
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
            <button class="read-button ${
				book.read ? 'read' : 'unread'
			}" onClick="myLibrary.toggleRead(${bookID})">${
		book.read ? 'Read' : 'Unread'
	}</button>
        </div>
        <div class="control-buttons-div">
            <button class="edit-button" onClick="myLibrary.editBook(${bookID})">Edit</button>
            <button class="delete-button" onClick="myLibrary.removeBook(${bookID})">Delete</button>
        </div>
    </div>`;
}

export default generateBookCardContent;
