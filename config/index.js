// Handles access to the `body` property in requests
const express = require("express");

// Responsible for the messages in the terminal as requests are coming in
const logger = require("morgan");

// Cookies, when dealing with authentication
const cookieParser = require("cookie-parser");

// Needed to accept requests from 'the outside'
const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN || "https://minibookclub.netlify.app";

// Middleware configuration
module.exports = (app) => {
  // Because this will be hosted on a server that will accept requests from outside and it will be hosted ona server with a `proxy`, express needs to know that it should trust that setting.
  app.set("trust proxy", 1);

  // controls a very specific header to pass headers from the frontend
  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
