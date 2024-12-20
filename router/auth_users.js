const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
]

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];  // Retrieve Book object associated with isbn
    const username = req.session.authorization?.username;


    if (book) {  // Check if Book exists
        let review = req.body.review;


        // Update review if provided in request body
        if (review) {
            book.reviews[username] = review;
        }


        books[isbn] = book;  // Update Book details in 'Books' object
        res.send(`Book with the isbn ${isbn} updated.`);
    } else {
        // Respond if Book with specified email is not found
        res.send("Unable to find Book!");
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract email parameter from request URL
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (isbn) {
        // Delete Book from 'Books' object based on provided email
        delete books[isbn].reviews[username];
    }

    // Send response confirming deletion of Book
    res.send(`Book review with the isbn ${isbn} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
