const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema ({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
        trim: true
    },
    year: {
        type: Number,
    },
    isbn: {
        type: String,
       // required: [true, 'ISBN is required'],
        maxlength: 13,
        unique: true,
        trim: true
    },
    genre: {
        type: String,
        //enum: ["romance", "fiction", "biography", "poetry"] 
    },
   author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
   },
    description: {
        type: String,
       // required: [true, 'Description is required'],
        trim: true
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    notes: [{
        type: mongoose.Schema.Types.Mixed,
        ref: "Note"
    }],
    coverURL: {
        type: String
    }
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;