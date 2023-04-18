const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
//returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password)=> {
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!password || !username) {
        return res.status(401).json({ message: "Error logging in." });
    }

    if(!authenticatedUser(username, password)) {
        return res.status(208).json({ message: "Invalid Login. Check username and password."});
    }

    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 3600 });
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in.", auth: req.session.authorization });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(!books[req.params.isbn]) {
        res.status(403).json({ message: "The book is not registered." });
    }
    const username = req.session.authorization['username'];
    books[req.params.isbn].reviews[username] = req.body.review;
    res.send("review is published successfully.");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(!books[req.params.isbn]) {
        res.status(403).json({ message: "The book is not registered." });
    }
    const username = req.session.authorization['username'];
    delete books[req.params.isbn].reviews[username];
    res.send("review is deleted successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
