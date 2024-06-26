const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET /users/:id - Get user by id
router.get("/users/:id", (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({
                _id: user._id,
                email: user.email,
                name: user.name,
       

            });
        })
        .catch((error) => {
            next(error);
        });
});

// PUT /users/:userId - Update user by id
router.put("/users/:id", isAuthenticated, (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body, { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((error) => {
            next(error);
        });
});

// DELETE /users/:userId - Delete user by id
router.delete("/users/:id", isAuthenticated, (req, res, next) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
        .then((deletedUser) => {
            res.json(deletedUser);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;

