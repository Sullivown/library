function setUpLocalStorage() {
	// If there is no books array in localStorage, create one
	if (!localStorage.getItem('books')) {
		localStorage.setItem('books', []);
		populateTestData(3);
	} else {
		// Populate the shelf with items from the library
		myLibrary.books = JSON.parse(localStorage.getItem('books'));
		myLibrary.refreshDisplay();
	}

	// If no settings data, create it
	if (!localStorage.getItem('settings')) {
		localStorage.setItem('settings', JSON.stringify(myLibrary.settings));
	} else {
		myLibrary.settings = JSON.parse(localStorage.getItem('settings'));
	}
}

export default setUpLocalStorage;
