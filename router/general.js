const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user. " + (req.body.username) });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //res.status(200).json({ message: "Welcome to the Book Store API" })
  res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author.toLowerCase();
    const filteredBooks = Object.values(books).filter(book =>
        book.author.toLowerCase() === authorName
    );

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for the specified author" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const authorName = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book =>
        book.title.toLowerCase() === authorName
    );

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for the specified author" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//callback promise variants

// Get the book list available in the shop
public_users.get('/callback/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "Books not found" });
        }
    }).then(books => res.send(JSON.stringify(books, null, 4)))
      .catch(err => res.status(404).json(err));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/callback/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    new Promise((resolve, reject) => {
        const book = books[ISBN];
        if (book) {
            resolve(book);
        } else {
            reject({ message: "Book not found" });
        }
    }).then(book => res.send(book))
        .catch(err => res.status(404).json(err));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/callback/:author', function (req, res) {
    const authorName = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === authorName);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ message: "No books found for the specified author" });
        }
    }).then(filteredBooks => res.status(200).json(filteredBooks))
        .catch(err => res.status(404).json(err));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/callback/:title', function (req, res) {
    const titleName = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === titleName);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ message: "No books found for the specified title" });
        }
    }).then(filteredBooks => res.status(200).json(filteredBooks))
        .catch(err => res.status(404).json(err));
    //return res.status(300).json({message: "Yet to be implemented"});
});


//module.exports.general = public_users;
module.exports = { general: public_users };
