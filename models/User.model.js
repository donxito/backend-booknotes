const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String, 
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    books: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    notes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    }

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
