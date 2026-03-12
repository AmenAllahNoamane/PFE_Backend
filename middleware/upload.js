const multer = require("multer");
const path = require("path");

const allowedMimeTypes = [ "application/pdf","image/png","image/jpeg"];

const allowedExtensions = [".pdf",".png",".jpg",".jpeg"];

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,"../uploads/documents"));
  },

  filename:(req,file,cb)=>{
    const uniqueName=Date.now()+"-"+Math.round(Math.random()*1e9);
    const extension=path.extname(file.originalname).toLowerCase();
    cb(null,uniqueName+extension);
  }
});

const fileFilter=(req,file,cb)=>{

  const extension=path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"),false);
  }

};

const upload=multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5*1024*1024
  }
});
module.exports = upload;