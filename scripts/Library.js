////////////////////////////////////////////////////////////////////////////////
// Storage Interface
////////////////////////////////////////////////////////////////////////////////
function StorageInterface(storage) {
  this.storage = storage;
  this.library = [];

  if (this.storage.getItem("nextID") === undefined) {
    this.storage.setItem("nextID", "1");
  } else {
    this.loadFromStorage();
  }
}

StorageInterface.prototype.storeBook = function (book) {
  book.ID = this.getNextID();
  this.library.push(book);
  this.storage.setItem(`${book.ID}`, JSON.stringify(book));
  const bookIDs = this.library.map((b) => b.ID);
  this.storage.setItem("bookIDs", bookIDs.join());
};

// Returns next ID. Increments nextID counter in storage
StorageInterface.prototype.getNextID = function () {
  const nextID = this.storage.getItem("nextID") ?? "1";
  this.storage.setItem("nextID", +nextID + 1);
  return nextID;
};

StorageInterface.prototype.loadFromStorage = function () {
  const IDs = this.storage.getItem("bookIDs");
  if (IDs) {
    for (ID of IDs.split(",")) {
      console.log(`Loading book with ID ${ID}`);
      const loadedBook = Object.assign(
        new Book(),
        JSON.parse(this.storage.getItem(`${ID}`))
      );
      this.library.push(loadedBook);
    }
  }
};

StorageInterface.prototype.deleteBook = function (bookID) {
  const bookIndex = this.library.map((b) => b.ID).indexOf(bookID);
  if (bookIndex !== -1) {
    this.library.splice(bookIndex, 1);
    this.storage.removeItem(`${bookIndex}`);
    const bookIDs = this.library.map((b) => b.ID);
    this.storage.setItem("bookIDs", bookIDs.join());
  }
};

////////////////////////////////////////////////////////////////////////////////
// Book
////////////////////////////////////////////////////////////////////////////////
function Book(author, title, numberOfPages, completed) {
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.completed = completed;
}

Book.prototype.getHTML = function () {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");

  const title = document.createElement("p");
  title.textContent = `${this.title}`;
  title.classList.add("title");

  const author = document.createElement("p");
  author.textContent = `${this.author}`;

  const numberOfPages = document.createElement("p");
  numberOfPages.textContent = `${this.numberOfPages}`;

  const completed = document.createElement("p");
  completed.textContent = this.completed ? "Finished" : "Not finished";

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(numberOfPages);
  bookDiv.appendChild(completed);

  return bookDiv;
};

//const bookList = document.querySelector(".book-list");
//function addBookToLibrary(book) {
//myLibrary.push(book);
//bookList.appendChild(book.getHTML());
//}

//const modal_init = function () {
//const modalWrapper = document.querySelector("#modal-wrapper");
//const bookInputForm = document.querySelector("#book-input-form");

//const openModal = function (e) {
//console.log("Opening modal");
//modalWrapper.className = "overlay";
//};

//const closeModal = function (e) {
//modalWrapper.className = "";
//};

//const escapeKeyHandler = function (e) {
//if (e.keyCode == 27) {
//closeModal(e);
//}
//};

//const clickHandler = (e) => {
//if (e.target.id != "book-input-form") {
//closeModal(e);
//}
//};

//document.querySelector("#add-book-button").addEventListener("click", (e) => {
//openModal();
//e.stopPropagation();
//});
//document.addEventListener("keydown", escapeKeyHandler, false);
//document.querySelector("#submit-book-button").addEventListener('submit', () => submitNewBook);
//// TODO (bbrady) - fix click handler
////document.addEventListener("click", clickHandler);
//};

//const titleInput = document.querySelector("#title-input");
//const authorInput = document.querySelector("#author-input");
//const pageTotalInput = document.querySelector("#number-of-pages-input");
//const completedInput = document.querySelector("#completed-input");
//function submitNewBook() {
//const newTitle = titleInput.value;
//const newAuthor = authorInput.value;
//const newPages = pageTotalInput.value;
//const newCompleted = completedInput.checked;

//const newBook = new Book(newAuthor, newTitle, newPages, newCompleted);
//addBookToLibrary(newBook);
//}

//function main() {
//modal_init();

//const exampleBook1 = new Book("Ray Bradbury", "Fahrenheit 451", 212, true);
//s.storeBook(exampleBook1);
//const exampleBook2 = new Book("Isaac Asimov", "Foundations", 150, false);
//s.storeBook(exampleBook2);

let s = new StorageInterface(localStorage);
s.deleteBook("3");

//}

//main();
