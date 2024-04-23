const Book = require('../models/Book.model');
const Author = require("../models/Author.model");


const isOwner = async (req, res, next) => {
    const userId = req.payload._id; 

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const bookId = req.params.bookId; 

    console.log("User ID:", userId);
    console.log("Book ID:", bookId);

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the user making the request matches the reader of the book
        if (book.reader._id.toString() !== userId) { 
            return res.status(403).json({ message: "Forbidden" });
        }

        next(); 
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { isOwner };