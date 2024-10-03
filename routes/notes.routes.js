const express = require("express");
const router = express.Router();
const logger = require("morgan");

const Note = require("../models/Notes.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { isOwner } = require("../middleware/isOwner.middleware.js");

// Middleware
router.use(logger("dev"));
router.use(express.json());

// ROUTES

// GET /notes
router.get("/notes", async (req, res, next) => {
    try {
        // Populate both bookId and user, and select only the name field from the user
        const notes = await Note.find()
            .populate("bookId")
            .populate("user", "name");
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
});

// POST /notes
router.post('/notes', isAuthenticated, async (req, res, next) => {
    try {

        console.log("user payload:", req.payload)
        const { book, content } = req.body;
        
        // Create a new note and associate it with the specified bookId
        const note = await Note.create({ book, content, user: req.payload._id });

        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
});

// GET /notes/:noteId
router.get("/notes/:noteId", async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.noteId);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
});

// PUT /notes/:noteId
router.put("/notes/:noteId", isAuthenticated, isOwner, async (req, res, next) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.noteId, req.body);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
});

// DELETE /notes/:noteId
router.delete("/notes/:noteId", isAuthenticated, isOwner, async (req, res, next) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.noteId);
        res.status(204).json(note);
    } catch (error) {
        next(error);
    }
});

// GET /books/:bookId/notes
router.get("/books/:bookId/notes", async (req, res, next) => {
 try {
   const notes = await Note.find({ bookId: req.params.bookId }).populate("user");
   res.status(200).json(notes); 
 } catch (error) {
   next(error);
 }
});

// GET /notes/:noteId/reader
router.get("/notes/:noteId/reader", async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.noteId).populate("user");
        res.status(200).json(note.reader);
    } catch (error) {
        next(error);
    }
});

// POST /books/:bookId/notes
router.post('/books/:bookId/notes', isAuthenticated, async (req, res, next) => {
    try {
      const { bookId } = req.params;
      const { notes } = req.body;
  
      console.log('Received request to add notes:', { bookId, notes });
  
      const book = await Book.findById(bookId);
      
      if (!book) {
        console.log('Book not found:', bookId);
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const newNotesIds = [];
  
      const notesToAdd = Array.isArray(notes) ? notes : [notes];
  
      for (const noteContent of notesToAdd) {
        const newNote = new Note({
          content: noteContent,
          book: book._id,
          user: req.payload._id
        });
  
        const savedNote = await newNote.save();
        console.log('Saved new note:', savedNote);
        newNotesIds.push(savedNote._id);
  
        book.notes.push(savedNote._id);
      }
  
      await book.save();
      console.log('Updated book with new notes:', book);
  
      const updatedBook = await Book.findById(bookId).populate('notes');
      console.log('Fetched updated book with populated notes:', updatedBook);
  
      res.status(201).json({ message: 'Notes added successfully', book: updatedBook });
    } catch (error) {
      console.error('Error adding notes:', error);
      next(error);
    }
  });

module.exports = router;
