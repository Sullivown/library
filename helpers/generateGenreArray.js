function generateGenreArray(id) {
	let genreOptionsArr = [];
	const isEdit = !isNaN(id);

	if (!isEdit) {
		genreOptionsArr.push(
			'<option value="other">--Please choose a genre--</option>'
		);
	}

	for (const property in myLibrary.settings.genres) {
		const book = myLibrary.books.find((element) => element.bookId === id);
		if (isEdit && book.genre == property) {
			genreOptionsArr.push(
				`<option value="${property}" selected>${myLibrary.settings.genres[property].name}</option>`
			);
		} else {
			genreOptionsArr.push(
				`<option value="${property}">${myLibrary.settings.genres[property].name}</option>`
			);
		}
	}

	return genreOptionsArr;
}

export default generateGenreArray;
