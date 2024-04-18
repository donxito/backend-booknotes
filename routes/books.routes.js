
// TO DO:

// 1 - DELETE WHAT YOU DON'T USE: path, fs, User, const book nas routes - MAS VER BEM SE TUDO FUNCIONA

// 2 - POR AS PROTECOES -  IS AUTHENTICATED, IS OWNER (VER EVENTSLAP)


const express = require('express');
const router = express.Router();
const logger = require('morgan');
const path = require('path');
const fs = require('fs');

const Book = require('../models/Book.model');
const Note = require('../models/Notes.model');
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { isOwner } = require("../middleware/isOwner.middleware.js");

const { fetchAndSaveCover } = require("../middleware/fetchAndSaveCover.middleware");

// Middleware
router.use(logger('dev'));
router.use(express.json());

// ROUTES

// GET /books
router.get('/books', async (req, res, next) => {
    try {
        // Retrieve all books from the database
        const books = await Book.find().populate('author').populate('reader').populate('notes');

        // Create an array of promises to fetch and save cover images for each book
        const coverPromises = books.map(book => fetchAndSaveCover(book.isbn));

        // Wait for all cover image fetch and save operations to complete
        await Promise.all(coverPromises);

        // Update book objects to include the URL of the book cover image
        const booksWithCoverURL = await Promise.all(books.map(async book => {
            await fetchAndSaveCover(book.isbn); // Fetch and save cover image
            return {
                ...book.toObject(), // Convert Mongoose document to plain JavaScript object
                coverURL: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
            };
        }));

        // Respond with the books including the cover image URL
        res.status(200).json(booksWithCoverURL);
        console.log('Books sent as response:', booksWithCoverURL);
    } catch (error) {
        next(error);
    }
});

// POST /books
router.post('/books', async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
});

// GET /books/:bookId
router.get('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId).populate('author').populate('reader').populate('notes');
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // Fetch and save cover image
        await fetchAndSaveCover(book.isbn);

        // Include the cover image URL in the book object
        const booksWithCoverURL = {
            ...book.toObject(), // Convert Mongoose document to plain JavaScript object
            coverURL: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
        };
        res.status(200).json(booksWithCoverURL);

    } catch (error) {
        next(error);
    }
});

// PUT /books/:bookId
router.put('/books/:bookId', async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
});

// DELETE /books/:bookId
router.delete('/books/:bookId', async (req, res, next) => {
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
        const book = await Book.findById(req.params.bookId).populate('notes');
        res.status(200).json(book.notes);
    } catch (error) {
        next(error);
    }
});

// POST /books/:bookId/notes
router.post('/books/:bookId/notes', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
});

// PUT /books/:bookId/notes/:noteId
router.put('/books/:bookId/notes/:noteId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        const note = await Note.findByIdAndUpdate(req.params.noteId, req.body);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
});

// DELETE /books/:bookId/notes/:noteId
router.delete('/books/:bookId/notes/:noteId', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.bookId);
        const note = await Note.findByIdAndDelete(req.params.noteId);
        res.status(204).json(note);
    } catch (error) {
        next(error);
    }
});





module.exports = router;
