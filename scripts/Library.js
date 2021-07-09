////////////////////////////////////////////////////////////////////////////////
// Storage Interface
////////////////////////////////////////////////////////////////////////////////
function StorageInterface(storage, bookListDiv) {
  this.storage = storage;
  this.bookListDiv = bookListDiv;
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
  // This prop assignment must come after saving to storage to avoid a
  // cyclic object value when calling JSON.stringify()
  book.storageInterface = this;
  const bookIDs = this.library.map((b) => b.ID);
  this.storage.setItem("bookIDs", bookIDs.join());
  this.renderBook(book);
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
      loadedBook.storageInterface = this;
      this.renderBook(loadedBook);
    }
  }
};

StorageInterface.prototype.deleteBook = function (bookID) {
  const bookIndex = this.library.map((b) => b.ID).indexOf(bookID.toString());
  if (bookIndex !== -1) {
    this.library.splice(bookIndex, 1);
    this.storage.removeItem(bookID.toString());
    const bookIDs = this.library.map((b) => b.ID);
    this.storage.setItem("bookIDs", bookIDs.join());
    const bookDiv = document.querySelector(`[data-bookID="${bookID}"]`);
    bookDiv.remove();
  }
};

StorageInterface.prototype.renderBook = function (book) {
  this.bookListDiv.appendChild(book.getHTML());
};

StorageInterface.prototype.updateBook = function (book) {
  const bookIndex = this.library.map((b) => b.ID).indexOf(book.ID.toString());
  if (bookIndex !== -1) {
    this.library[bookIndex] = book;
    // Janky workaround to avoid cyclic reference. Probably should have a
    // proper serialization method for Book, but this works
    delete book.storageInterface;
    this.storage.setItem(`${book.ID}`, JSON.stringify(book));
    // This prop assignment must come after saving to storage to avoid a
    // cyclic object value when calling JSON.stringify()
    book.storageInterface = this;
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
  bookDiv.setAttribute("data-bookID", `${this.ID}`);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("hoverable-button");
  deleteButton.addEventListener("click", () => {
    this.storageInterface.deleteBook(this.ID);
  });

  const toggleReadStatusButton = document.createElement("button");
  toggleReadStatusButton.textContent = "Toggle Read Status";
  toggleReadStatusButton.classList.add("hoverable-button");

  const title = document.createElement("p");
  title.textContent = `${this.title}`;
  title.classList.add("title");

  const author = document.createElement("p");
  author.textContent = `${this.author}`;

  const numberOfPages = document.createElement("p");
  numberOfPages.textContent = `${this.numberOfPages}`;

  const completed = document.createElement("p");
  completed.textContent = this.completed ? "Finished" : "Not finished";

  toggleReadStatusButton.addEventListener("click", () => {
    this.completed = !this.completed;
    completed.textContent = this.completed ? "Finished" : "Not finished";
    this.storageInterface.updateBook(this);
  });

  bookDiv.appendChild(deleteButton);
  bookDiv.appendChild(toggleReadStatusButton);
  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(numberOfPages);
  bookDiv.appendChild(completed);

  return bookDiv;
};

////////////////////////////////////////////////////////////////////////////////
// UI
////////////////////////////////////////////////////////////////////////////////
const bookList = document.querySelector("#book-list");
const submitBookButton = document.querySelector("#submit-book-button");
submitBookButton.addEventListener("click", submitBook);

const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const pagesInput = document.querySelector("#number-of-pages-input");
const completedInput = document.querySelector("#completed-input");
const closeInputFormButton = document.querySelector("#close-book-input-form");
const bookInputForm = document.querySelector("#book-input-form");
function submitBook() {
  if (!bookInputForm.checkValidity()) {
    return false;
  }
  const newTitle = titleInput.value;
  const newAuthor = authorInput.value;
  const newPages = pagesInput.value;
  const newCompleted = completedInput.checked;

  const newBook = new Book(newAuthor, newTitle, newPages, newCompleted);
  s.storeBook(newBook);
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  completedInput.checked = false;
  closeInputFormButton.click();
  return false;
}

const modal_init = function () {
  const modalWrapper = document.querySelector("#modal-wrapper");

  const openModal = function (e) {
    console.log("Opening modal");
    modalWrapper.className = "overlay";
  };

  const closeModal = function (e) {
    modalWrapper.className = "";
  };

  const escapeKeyHandler = function (e) {
    if (e.keyCode == 27) {
      closeModal(e);
    }
  };

  const clickHandler = (e) => {
    if (e.target.id != "book-input-form") {
      closeModal(e);
    }
  };

  document.querySelector("#add-book-button").addEventListener("click", (e) => {
    openModal();
    e.stopPropagation();
  });
  document.addEventListener("keydown", escapeKeyHandler, false);
  closeInputFormButton.addEventListener("click", closeModal);
  //document.addEventListener("click", clickHandler);
};

modal_init();
let s = new StorageInterface(localStorage, bookList);
