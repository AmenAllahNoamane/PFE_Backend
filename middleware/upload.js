const multer = require("multer");
const path = require("path");
const fs = require("fs");



const allowedMimeTypes = [ "application/pdf", "image/png","image/jpeg"];

const allowedExtensions = [ ".pdf",".png",".jpg",".jpeg"];



const uploadDir = path.join(__dirname, "../uploads/documents");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Dossier uploads/documents créé');
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName + extension);
  }
});



const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error("Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG"), 
      false
    );
    
  }
};


const upload = multer({ storage: storage,  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

module.exports = upload;