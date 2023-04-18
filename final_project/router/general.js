const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username; 
  const password = req.body.password;
  if(!password || !username) {
    return res.status(403).json({ message: "Unable to register user!" });
  }

  if(users.some(user => user.username === username)) {
    return res.status(403).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User sucessfully registered." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const booksResult = new Promise((resolve, reject) => { resolve(books) })
  booksResult.then((booksResult) => {
    return res.send(JSON.stringify(booksResult)); 
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const bookResult = new Promise((resolve, reject) => { resolve(books[req.params.isbn]) });
  bookResult.then(isbnbook => {
      return res.send(JSON.stringify(isbnbook));
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const bookResult = new Promise((resolve, reject) => { resolve(Object.values(books).filter(book => book.author.indexOf(req.params.author) !== -1)) });
  bookResult.then(authorbook => {
    return res.send(JSON.stringify(authorbook));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookResult = new Promise((resolve, reject) => { resolve(Object.values(books).filter(book => book.title.indexOf(req.params.title) !== -1)) });
  bookResult.then(titlebook => {
    return res.send(JSON.stringify(titlebook));
  });    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnbook = books[req.params.isbn];
    return res.send(JSON.stringify(isbnbook.reviews));
});

module.exports.general = public_users;
