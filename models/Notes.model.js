const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema ({
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        //required: [true, 'The book is required'],
        ref: "Book"
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        //required: [true, 'The book is required'],
        ref: "Book"
    }
});

noteSchema.set('timestamps', true);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;