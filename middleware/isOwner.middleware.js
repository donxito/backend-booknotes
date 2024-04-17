
const Book = require('../models/Book.model');
const Author = require("../models/Author.model");


const isOwner = async (req, res, next) => {
    const userId = req.payload._id; 

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const bookId = req.params.bookId; 
    const authorId = req.params.authorId; 

   
    console.log("User ID:", userId);
    console.log("Book ID:", bookId);
    console.log("Author ID:", authorId);

    try {
        if (bookId) {
            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            if (book.user.toString() !== userId) { 
                return res.status(403).json({ message: "Forbidden" });
            }
        } else if (authorId) {
            const author = await Author.findById(authorId);
            if (!author) {
                return res.status(404).json({ message: "Venue not found" });
            }
            if (author.user.toString() !== userId) { 
                return res.status(403).json({ message: "Forbidden" });
            }
        }

        next(); 
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { isOwner };
