const { Schema, model } = require("mongoose");

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
    username: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
      default: "https://variety.com/wp-content/uploads/2021/04/Avatar.jpg?w=800&h=533&crop=1",
    },
    about: {
      type: String,
      default: "I am using BookNotes.",
    }

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
