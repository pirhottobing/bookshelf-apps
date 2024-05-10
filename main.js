const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
  return +new Date();
}

function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem
    }
  }
  return null;
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_SHELF';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const bookTitle = document.getElementById('inputTitle').value;
  const bookAuthor = document.getElementById('inputAuthor').value;
  const bookYear = document.getElementById('inputYear').value;
 
  const generatedID = generateId();
  const yearIsNumber = parseInt(bookYear);
  const bookObject = generateBook(generatedID, bookTitle, bookAuthor, yearIsNumber, false);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function incompleteBookButton(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completeBookButton (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(); 
}

function removeBookButton(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

books.splice(bookTarget, 1);
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function listBook(bookObject) {
  
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis : ${bookObject.author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun : ${bookObject.year}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('action');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('article');
  container.classList.add('book-item');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);


  if(bookObject.isComplete) {
    const incompleteButton = document.createElement('button');
    incompleteButton.innerText ='Belum selesai';
    incompleteButton.classList.add('button1');

    incompleteButton.addEventListener('click', function() {
      incompleteBookButton(bookObject.id);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Hapus buku';
    removeButton.classList.add('button2');

    removeButton.addEventListener('click', function () {
      removeBookButton(bookObject.id);
    });

    container.append(incompleteButton, removeButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.innerText = 'Selesai dibaca'
    completeButton.classList.add('button1');

    completeButton.addEventListener('click', function () {
      completeBookButton(bookObject.id);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Hapus buku';
    removeButton.classList.add('button2');

    removeButton.addEventListener('click', function () {
      removeBookButton(bookObject.id);
    });

    container.append(completeButton, removeButton)
  }

  return container;
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('input');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadData();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBook = document.getElementById('incompleteBook');
  uncompleteBook.innerHTML = '';

  const completeBook = document.getElementById('completeBook');
  completeBook.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = listBook(bookItem);
    if (!bookItem.isComplete) {
      uncompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});