const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");


// Upload document
router.post("/upload", upload.single("file"), (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    if (!fs.existsSync(req.file.path)) {
      return res.status(500).json({
        message: "File storage failed"
      });
    }

    res.status(200).json({
    message: "Upload successful",
    document: {
    originalName: req.file.originalname,
    filePath: `/uploads/documents/${req.file.filename}`,
    status: "EN_COURS",
    extractedData: null,
    confidenceScore: null,
    createdAt: new Date()
  }
});

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// List documents
router.get("/documents", (req, res) => {

  try {

    const directoryPath = path.join(__dirname, "../uploads/documents");

    fs.readdir(directoryPath, (err, files) => {

      if (err) {
        return res.status(500).json({
          message: "Unable to scan files"
        });
      }

      const documents = files.map(file => ({
        name: file,
        url: `/uploads/documents/${file}`
      }));

      res.status(200).json({
        count: documents.length,
        documents: documents
      });

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


module.exports = router;