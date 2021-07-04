let myLibrary = [];

function Book(author, title, numberOfPages, completed) {
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.completed = completed;
}

Book.prototype.getHTML = function() {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const title = document.createElement('p');
  title.textContent = `${this.title}`;
  title.classList.add('title');

  const author = document.createElement('p');
  author.textContent = `${this.author}`;

  const numberOfPages = document.createElement('p');
  numberOfPages.textContent = `${this.numberOfPages}`;

  const completed = document.createElement('p');
  completed.textContent = this.completed ? 'Finished' : 'Not finished';



  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(numberOfPages);
  bookDiv.appendChild(completed);

  return bookDiv;
}

const bookList = document.querySelector(".book-list");
function addBookToLibrary(book) {
  myLibrary.push(book);
  bookList.appendChild(book.getHTML());
}

function displayBooks(){}

const exampleBook1 = new Book("Ray Bradbury", "Fahrenheit 451", 212, true);
const exampleBook2 = new Book("Isaac Asimov", "Foundations", 150, false);
addBookToLibrary(exampleBook1);
addBookToLibrary(exampleBook2);



const modal_init = function() {
  const modalWrapper = document.querySelector("#modal-wrapper");
  const bookInputForm = document.querySelector("#book-input-form");

  const openModal = function(e) {
    console.log("Opening modal");
    modalWrapper.className = "overlay";
  }

  const closeModal = function(e) {
    modalWrapper.className = "";
  }

  const escapeKeyHandler = function(e) {
    if (e.keyCode == 27) {
      closeModal(e);
    }
  }

  const clickHandler = e => {
    if (e.target.id != "book-input-form") {
      closeModal(e);
    }
  };

  document.querySelector("#add-book-button").addEventListener('click', 
    e => {openModal(); e.stopPropagation()});
  document.addEventListener('keydown', escapeKeyHandler, false);
  document.addEventListener('click', clickHandler);

}

modal_init();