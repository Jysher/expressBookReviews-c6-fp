const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = username => {
  return users.every(user => user.username !== username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No request body found.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Please enter a username or password.' });
  }

  if (!authenticatedUser(username, password)) {
    return res
      .status(400)
      .json({ message: 'Invalid login. Check username or password.' });
  }

  const accessToken = jwt.sign({ data: username }, 'access', {
    expiresIn: 60 * 60,
  });
  req.session.authorization = {
    accessToken,
    username,
  };

  res.status(200).send('Logged in successfully.');
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `Could not find book with ISBN: ${isbn}` });
  }

  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ message: 'Please enter a review.' });
  }

  const user = req.session.authorization.username;
  book.reviews[user] = review;
  res.send(`Review by ${user} has been posted.`);
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `Could not find book with ISBN: ${isbn}` });
  }

  const user = req.session.authorization.username;
  delete book.reviews[user];
  res.send(`Review by ${user} has been deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
