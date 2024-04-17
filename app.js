// Gets access to environment variables/settings
require("dotenv").config();

// Connects to the database
require("./db");

// Handles http requests (express is node js framework)
const express = require("express");

const app = express();

// This function is getting exported from the config folder. It the middleware
require("./config")(app);

// ROUTES
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const booksRoutes = require("./routes/books.routes");
app.use("/", booksRoutes);

const authorsRoutes = require("./routes/authors.routes");
app.use("/", authorsRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);


const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// To handle errors
require("./error-handling")(app);

module.exports = app;
