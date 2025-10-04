const multer = require('multer');
const path = require('path');
const { FILE_UPLOAD } = require('../config/constants');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = FILE_UPLOAD.ALLOWED_IMAGE_TYPES.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = FILE_UPLOAD.ALLOWED_MIME_TYPES.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Allowed: jpeg, jpg, png, gif, webp'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_UPLOAD.MAX_SIZE },
});

module.exports = upload;
