const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const natural = require("natural");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const tokenizer = new natural.SentenceTokenizer();

function extractQAPairs(text) {
  const sentences = tokenizer.tokenize(text);
  const qaPairs = {};

  sentences.forEach((sentence) => {
    const lower = sentence.toLowerCase();

    // Example logic: very basic keyword-based Q&A pattern
    if (lower.includes("is") && sentence.endsWith(".")) {
      const [term, ...defParts] = sentence.split(" is ");
      if (term && defParts.length > 0) {
        const key = term.trim();
        const answer = sentence.trim();
        if (key.length < 40 && answer.length < 300) {
          qaPairs[key] = answer;
        }
      }
    }
  });

  return qaPairs;
}

router.post("/pdf", upload.single("file"), async (req, res) => {
  const dataBuffer = fs.readFileSync(req.file.path);

  try {
    const data = await pdfParse(dataBuffer);
    fs.unlinkSync(req.file.path); // remove temp file

    const qaPairs = extractQAPairs(data.text);
    res.json({ success: true, qa: qaPairs });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

module.exports = router;
