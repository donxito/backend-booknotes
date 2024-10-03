const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
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
        required: [true, 'ISBN is required'],
        maxlength: 13,
        unique: true,
        trim: true
    },
    genre: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: [true, 'Author is required']
    },
    description: {
        type: String,
        trim: true
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    coverURL: {
        type: String
    },
    notes: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}]
}, { 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;