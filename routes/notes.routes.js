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
        const notes = await Note.find().populate("book").populate("user");
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
});

// POST /notes
router.post('/notes', isAuthenticated, async (req, res, next) => {
    try {

        console.log("user payload:", req.payload)
        const { bookId, content } = req.body;
        
        // Create a new note and associate it with the specified bookId
        const note = await Note.create({ bookId, content, user: req.payload._id });

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
router.put("/notes/:noteId", isAuthenticated, async (req, res, next) => {
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

// GET /notes/:noteId/reader
router.get("/notes/:noteId/reader", async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.noteId).populate("user");
        res.status(200).json(note.reader);
    } catch (error) {
        next(error);
    }
});

// GET /notes/:bookId
router.get("/books/:bookId", async (req, res, next) => {
    try {
        console.log("Received bookId:", req.params.bookId);
        const bookId = req.params.bookId;
        const notes = await Note.find({ bookId }).populate("book").populate("user");
        console.log("Found notes:", notes);
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
