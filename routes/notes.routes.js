const express = require("express");
const router = express.Router();
const logger = require("morgan");

const Note = require("../models/Notes.model");
const Book = require("../models/Book.model");
const User = require("../models/User.model");

// Midleware
router.use(logger("dev"));
router.use(express.json());

// ROUTES

// GET /notes
router.get("/notes", async (req, res, next) => {
    try {
        const notes = await Note.find().populate("book").populate("reader");
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
});

// POST /notes
router.post("/notes", async (req, res, next) => {
    try {
        const note = await Note.create(req.body);
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
router.put("/notes/:noteId", async (req, res, next) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.noteId, req.body);
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
});

// DELETE /notes/:noteId
router.delete("/notes/:noteId", async (req, res, next) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.noteId);
        res.status(204).json(note);
    } catch (error) {
        next(error);
    }
});
// GET /notes/:noteId/readers
router.get("/notes/:noteId/readers", async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.noteId).populate("readers");
        res.status(200).json(note.readers);
    } catch (error) {
        next(error);
    }
});

module.exports = router;