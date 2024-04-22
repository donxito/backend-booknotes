const express = require("express");
const router = express.Router();
const logger = require("morgan");


const Author = require("../models/Author.model");
const Book = require("../models/Book.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { isOwner } = require("../middleware/isOwner.middleware.js");


// Middleware
router.use(logger("dev"));
router.use(express.json());

// ROUTES

// GET /authors
router.get("/authors", async (req, res, next) => {
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (error) {
        next(error);
    }
});

// POST /authors
router.post("/authors", isAuthenticated, async (req, res, next) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json(author);
    } catch (error) {
        next(error);
    }
});

// GET /authors/:authorId
router.get("/authors/:authorId", async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.authorId);
        res.status(200).json(author);
    } catch (error) {
        next(error);
    }
});

// PUT /authors/:authorId
router.put("/authors/:authorId", isAuthenticated, async (req, res, next) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.authorId, req.body, { new: true });
        res.status(200).json(author);
    } catch (error) {
        next(error);
    }
});

// DELETE /authors/:authorId
router.delete("/authors/:authorId", isAuthenticated, isOwner, async (req, res, next) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.authorId);
        res.status(204).json(author);
    } catch (error) {
        next(error);
    }
});

// GET /authors/:authorId/books
router.get("/authors/:authorId/books", async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.authorId).populate("books");
        res.status(200).json(author.books);
    } catch (error) {
        next(error);
    }
});

// POST /authors/:authorId/books
router.post("/authors/:authorId/books", isAuthenticated, async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.authorId);
        const book = await Book.create(req.body);
        author.books.push(book);
        await author.save();
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
});


module.exports = router;