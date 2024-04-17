const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("Hello book readers");
});

module.exports = router;
