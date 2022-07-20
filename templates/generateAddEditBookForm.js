import generateGenreArray from '../helpers/generateGenreArray.js';

function generateAddEditBookForm(id) {
	// Returns a blank or pre-filled form depending on whether or not an ID is passed to the function
	const isEdit = !isNaN(id);
	let genreOptionsArr = generateGenreArray(id);

	const book = myLibrary.books.find((element) => element.bookId === id);

	return `
	<form action="javascript:void(0);">
		<input type="text" name="title" placeholder="Title" value="${
			isEdit ? book.title : ''
		}" required>
		<input type="text" name="author" placeholder="Author" value="${
			isEdit ? book.author : ''
		}" required>
		<select name="genre">
			${genreOptionsArr.join('')}
		</select>
		<input type="number" name="pages" placeholder="Total Pages" value="${
			isEdit ? book.pages : ''
		}">
		<input type="number" name="rating" placeholder="Rating" min="1" max="5" value="${
			isEdit ? book.rating : ''
		}">
		<div>
			<label for="read">Read?</label><input type="checkbox" name="read" ${
				!isEdit ? '' : book.read ? 'checked' : ''
			}>
		</div>
			<button type="button" class="save-book">Save</button>
		${isEdit ? `<button type="button" class="cancel-edit">Cancel</button>` : ''}
    </form>
	`;
}

export default generateAddEditBookForm;
