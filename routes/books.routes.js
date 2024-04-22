
const express = require('express');
const router = express.Router();
const logger = require('morgan');


const Book = require('../models/Book.model');
const Note = require('../models/Notes.model');


const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { isOwner } = require("../middleware/isOwner.middleware.js");



// Middleware
router.use(logger('dev'));
router.use(express.json());

// ROUTES

// GET /books
router.get('/books', async (req, res, next) => {
    try {
        // Retrieve all books from the database
        const books = await Book.find().populate('author').populate('reader').populate({
            path: 'notes',
            model: 'Note'
        });

        const booksWithCoverURL = books.map(book => ({
            ...book.toObject(), // Convert Mongoose document to plain JavaScript object
            coverURL: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
        }));

        res.status(200).json(booksWithCoverURL);
    } catch (error) {
        next(error);
    }
});

// POST /books
router.post('/books', isAuthenticated, async (req, res, next) => {
    try {
        // Extract book data from the request body
        const { title, author, notes, year, isbn, genre, description, coverURL } = req.body;

        const {_id: userId} = req.payload;

        // Create the book document
        const book = await Book.create({
            title,
            author, // Assuming author is already an ObjectId
            year,
            isbn,
            genre,
            description,
            reader: userId,
            coverURL
        });

        // Check if notes are provided and create associated notes
        if (notes && notes.length > 0) {
            // Extract note contents from the request body
            const noteContents = Array.isArray(notes) ? notes : [notes];

            // Create new note documents
            const createdNotes = await Promise.all(noteContents.map(async content => {
                const note = await Note.create({ content, bookId: book._id });
                return note._id; // Return only the ID of the created note
            }));

            // Update the book document with the associated note IDs
            book.notes = createdNotes;
            await book.save();
        }

        // Send a success response with the created book
        res.status(201).json(book);
    } catch (error) {
        // Handle any errors and pass them to the error handling middleware
        next(error);
    }
});





// GET /books/:bookId
router.get('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId)
        .populate('author')
        .populate('reader')
        .populate({
            path: 'notes',
            model: 'Note'
        });
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        console.log('Populated Book:', book);

        const bookWithCoverURL = {
            ...book.toObject(),
            coverURL: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
        };
        res.status(200).json(bookWithCoverURL);

    } catch (error) {
        next(error);
    }
});


// PUT /books/:bookId
router.put('/books/:bookId', isAuthenticated, isOwner, async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
});

// DELETE /books/:bookId
router.delete('/books/:bookId', isAuthenticated, isOwner ,async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.bookId);
        res.status(204).json(book);
    } catch (error) {
        next(error);
    }
});


// GET /books/:bookId/notes
router.get('/books/:bookId/notes', async (req, res, next) => {
    try {
        const { bookId } = req.params;
        
        // Find all notes associated with the specified book ID
        const notes = await Note.find({ bookId });

        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
});



// POST /books/:bookId/notes
router.post('/books/:bookId/notes', isAuthenticated, async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { notes } = req.body;

        console.log('Request body:', req.body); // Log the request body to inspect the notes data

        // Find the existing book document by its ID
        const book = await Book.findById(bookId);
        
        // Check if the book exists
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Array to store the IDs of the created notes
        const newNotesIds = [];

        // Create a new note document and associate them with the book
        for (const noteContent of notes) {
            console.log('Note content:', noteContent);
            const newNote = new Note({
                content: noteContent,
                bookId: book._id
            });

            const savedNote = await newNote.save();
            newNotesIds.push(savedNote._id);

            // Add the new note to the book document
            book.notes.push(savedNote._id);
        }

        // Save the updated book document
        await book.save();

        // Respond with the created notes
        res.status(201).json({ message: 'Notes added successfully', newNotesIds });
    } catch (error) {
        next(error);
    }
});




// PUT /books/:bookId/notes/:noteId
router.put('/books/:bookId/notes/:noteId', isAuthenticated, async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        const note = await Note.findByIdAndUpdate(req.params.noteId, req.body);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
});

// DELETE /books/:bookId/notes/:noteId
router.delete('/books/:bookId/notes/:noteId', isAuthenticated, isOwner,async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        const note = await Note.findByIdAndDelete(req.params.noteId);
        res.status(204).json(note);
    } catch (error) {
        next(error);
    }
});





module.exports = router;
