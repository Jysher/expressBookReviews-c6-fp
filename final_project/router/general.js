const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No request body found.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Please enter a username or password.' });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  users.push({ username: username, password: password });
  res.status(200).send(`User: ${username} has been registered!`);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Task 1
  // res.send(JSON.stringify(books, null, 4));

  // Task 10
  const getAllBooksProm = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });

  getAllBooksProm
    .then(result => {
      res.send(JSON.stringify(result, null, 4));
    })
    .catch(err => {
      res.status(500).json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Task 2
  /* const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: `Could not find book with ISBN: ${isbn}` });
  }

  res.send(JSON.stringify(books[isbn], null, 4)); */

  // Task 11
  const getBookIsbn = new Promise((resolve, reject) => {
    setTimeout(() => {
      const isbn = req.params.isbn;
      if (!books[isbn]) {
        reject({ message: `Could not find book with ISBN: ${isbn}` });
      }
      resolve(books[isbn]);
    }, 3000);
  });

  getBookIsbn
    .then(result => {
      res.send(JSON.stringify(result, null, 4));
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Task 3
  /* const author = req.params.author;
  const bookAuthor = Object.values(books).filter(
    book => book.author === author
  );

  if (bookAuthor.length === 0) {
    return res
      .status(404)
      .json({ message: `Could not find book with author: ${author}` });
  }

  res.send(JSON.stringify(bookAuthor, null, 4)); */

  // Task 12
  const getBookAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      const author = req.params.author;
      const bookAuthor = Object.values(books).filter(
        book => book.author === author
      );

      if (bookAuthor.length === 0) {
        reject({ message: `Could not find book with author: ${author}` });
      }

      resolve(bookAuthor);
    }, 3000);
  });

  getBookAuthor
    .then(result => {
      res.send(JSON.stringify(result, null, 4));
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Task 4
  /* const title = req.params.title;
  const bookTitle = Object.values(books).find(book => book.title === title);

  if (!bookTitle) {
    return res
      .status(404)
      .json({ message: `Could not find book with title: ${title}` });
  }

  res.send(JSON.stringify(bookTitle, null, 4)); */

  // Task 13
  const getBookTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const title = req.params.title;
      const bookTitle = Object.values(books).find(book => book.title === title);

      if (!bookTitle) {
        reject({ message: `Could not find book with title: ${title}` });
      }

      resolve(bookTitle);
    }, 3000);
  });

  getBookTitle
    .then(result => {
      res.send(JSON.stringify(result, null, 4));
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `Could not find book with ISBN: ${isbn}` });
  }

  if (!book?.reviews || Object.values(book.reviews).length === 0) {
    return res
      .status(404)
      .json({ message: `Could not find reviews for ${book.title}` });
  }

  res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
