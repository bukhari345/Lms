// import multer from 'multer'

// const storage = multer.memoryStorage()

// const upload = multer({
//     storage: storage,

// });

// export default upload

import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save the files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB in bytes
  }
  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb);
  // }
});

// Check file type
function checkFileType(file: any, cb: any) {
  const filetypes = /jpeg|jpg|png|gif|pdf|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images, PDFs, and Videos Only!');
  }
}

export default upload;
