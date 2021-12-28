// Book class: represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: handles UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
    list.appendChild(row);
  }

  static deleteBook(el) {
    console.log(el);
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove(); /*parentelement.parentelement removes the parent tag in this case it is "tr" which will help to remove the whole row or else it will just remove the delete button*/
    }
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //VANISH IN 3 S
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
  static clearFields() {
    document.querySelector("#title").value = " ";
    document.querySelector("#author").value = " ";
    document.querySelector("#isbn").value = " ";
  }
}

//STORE CLASS: HANDLES STORAGE
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//EVENT:DISPLAY BOOKS
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//EVENT:ADD BOOKS
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //PREVENT ACTUAL SUBMIT
  e.preventDefault();
  //get from values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //VALIDATE
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "success");
  } else {
    //instantiate book
    const book = new Book(title, author, isbn);
    // console.log(book);
    //add book to UI
    UI.addBookToList(book);
    //ADD BOOK TO STORE
    Store.addBook(book);

    //SHOW SUCCESS MESSAGE
    UI.showAlert("BOOK ADDED", "success");

    //clear fields
    UI.clearFields();
  }
});

//EVENT:REMOVE BOOKS
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  //remove book from store
  Store.removeBook(
    e.target.parentElement.previousElementSibling.textContent
  ); /*here parentElement becomes "Td"  and here we travere the dom with previousElementsibling  which gives THE PREVIOUS  "td" element which is isbn */

  //show success message
  UI.showAlert("Book Removed", "success");
});
