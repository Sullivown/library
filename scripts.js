// Firebase setup
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js';
import {
	getFirestore,
	collection,
	query,
	doc,
	addDoc,
	getDoc,
	setDoc,
	deleteDoc,
	getDocs,
	onSnapshot,
} from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js';
import {
	getAuth,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js';

const firebaseConfig = {
	apiKey: 'AIzaSyBQWzIoPD5o32JRj1Glo67Btw36_f0O_3k',
	authDomain: 'library-24ce8.firebaseapp.com',
	projectId: 'library-24ce8',
	storageBucket: 'library-24ce8.appspot.com',
	messagingSenderId: '395218316952',
	appId: '1:395218316952:web:4d2da70762fd94e649aaed',
};

import Library from './classes/Library.js';
import addEditBookCard from './helpers/addEditBookCard.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// User authentication
async function signIn() {
	// Sign in Firebase using popup auth and Google as the identity provider.
	var provider = new GoogleAuthProvider();
	await signInWithPopup(getAuth(), provider);
}

function authStateObserver(user) {
	if (user) {
		signInOutButton.textContent = 'Sign Out';
		createLibrary();
		loadBooks();
	} else {
		signInOutButton.textContent = 'Sign In';
	}
}

// Signs-out of Friendly Chat.
function signOutUser() {
	// Sign out of Firebase.
	signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
	// Listen to auth state changes.
	onAuthStateChanged(getAuth(), authStateObserver);
}

initFirebaseAuth();

// Creates a user library doc
export async function createLibrary() {
	const uid = getAuth().currentUser.uid;
	const libraries = collection(db, 'libraries');

	// Add a user library entry to the Firebase database.
	try {
		await setDoc(doc(libraries, uid), { uid });
	} catch (error) {
		console.error('Error writing new library to Firebase Database', error);
	}
}

// Saves a new book to Cloud Firestore.
export async function saveBook(bookData) {
	const uid = getAuth().currentUser.uid;
	const libraries = collection(db, 'libraries');
	const userLibrary = doc(libraries, uid);
	const books = collection(userLibrary, 'books');

	// Add a new book entry to the Firebase database.
	try {
		await setDoc(doc(books, bookData.bookId.toString()), bookData);
	} catch (error) {
		console.error('Error writing new book to Firebase Database', error);
	}
}

// Deletes a book
export async function deleteBook(bookData) {
	const uid = getAuth().currentUser.uid;
	const bookRef = doc(
		db,
		'libraries',
		uid,
		'books',
		bookData.bookId.toString()
	);

	try {
		await deleteDoc(bookRef);
	} catch (error) {
		console.error('Error removing book from Firebase Database', error);
	}
}

// Create the library
window.myLibrary = new Library();
let myLibrary = window.myLibrary;

// Selectors
const shelf = document.querySelector('.library-shelf');
const addNewButton = document.querySelector('#add-new-book');
const body = document.querySelector('body');
const header = document.querySelector('header');
const signInOutButton = document.querySelector('#login');

// Add book button handler
addNewButton.addEventListener('click', () => {
	if (addNewButton.textContent === 'Add New Book') {
		addEditBookCard();
	} else {
		document.querySelector('.addBookBanner').remove();
		addNewButton.textContent = 'Add New Book';
	}
});

// User sign in buttons
signInOutButton.addEventListener('click', () => {
	if (getAuth().currentUser) {
		signOutUser();
	} else {
		signIn();
	}
});

// Function to populate the library with data for testing
function populateTestData(numOfBooks) {
	for (let i = 1; i <= numOfBooks; i++) {
		myLibrary.addBook(
			`Title ${i}`,
			`Author ${i}`,
			`thriller`,
			i * 100,
			5,
			i % 3 === 0 ? false : true
		);
	}
}

// Initialize the library
document.addEventListener('DOMContentLoaded', () => {
	// setUpLocalStorage();
});

function loadBooks() {
	const uid = getAuth().currentUser.uid;
	const libraries = collection(db, 'libraries');
	const userLibrary = doc(libraries, uid);
	const books = collection(userLibrary, 'books');
	const booksQuery = query(books);

	// Start listening to the query.
	onSnapshot(booksQuery, function (snapshot) {
		snapshot.docChanges().forEach(function (change) {
			if (change.type === 'added') {
				myLibrary.addBook(change.doc.data());
				myLibrary.createBookCard(change.doc.data());
			}
			if (change.type === 'modifed') {
				myLibrary.createBookCard(change.doc.data());
			}
		});
	});
}

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
