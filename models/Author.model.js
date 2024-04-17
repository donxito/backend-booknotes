const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }
    ]
}) 

const Author = mongoose.model("Author", authorSchema)

module.exports = Author;