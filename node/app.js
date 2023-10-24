const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

const booksFilePath = "./books.json";

const getBooks = () => {
  const booksData = fs.readFileSync(booksFilePath);
  return JSON.parse(booksData);
};

const saveBooks = (books) => {
  const booksData = JSON.stringify(books, null, 2);
  fs.writeFileSync(booksFilePath, booksData);
};

app.get("/books", (req, res) => {
  const books = getBooks();
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const books = getBooks();
  const book = books.find((b) => b.id == req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Livre non trouvé");
  }
});

app.get("/books/search/:titre", (req, res) => {
  const books = getBooks();
  const book = books.find(
    (b) => b.titre.toLowerCase() === req.params.titre.toLowerCase()
  );
  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Livre non trouvé");
  }
});

app.post("/books", (req, res) => {
  const books = getBooks();
  const newBook = req.body;
  newBook.id = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
  books.push(newBook);
  saveBooks(books);
  res.status(201).send(newBook);
});

app.put("/books/:id", (req, res) => {
  const books = getBooks();
  const index = books.findIndex((b) => b.id == req.params.id);
  if (index > -1) {
    books[index] = { ...books[index], ...req.body };
    saveBooks(books);
    res.send(books[index]);
  } else {
    res.status(404).send("Livre non trouvé");
  }
});

app.delete("/books/:id", (req, res) => {
  let books = getBooks();
  const index = books.findIndex((b) => b.id == req.params.id);
  if (index > -1) {
    books = books.filter((b) => b.id != req.params.id);
    saveBooks(books);
    res.send("Livre supprimé");
  } else {
    res.status(404).send("Livre non trouvé");
  }
});

app.listen(port, () => {
  console.log(`Serveur ON : http://localhost:${port}/books`);
});
