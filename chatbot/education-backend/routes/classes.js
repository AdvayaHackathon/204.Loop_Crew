const express = require("express");
const router = express.Router();
const knowledge = require("../data/knowledgeBase.json");

router.get("/:className", (req, res) => {
  const className = req.params.className;
  const data = knowledge[className];
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: "Class not found" });
  }
});

module.exports = router;
