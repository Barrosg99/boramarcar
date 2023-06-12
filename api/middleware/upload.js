const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Aceitamos apenas imagens.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../static/temp/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-boramarcar-${file.originalname}`);
  },
});

const uploadFile = multer({ storage, fileFilter: imageFilter });
module.exports = uploadFile;
