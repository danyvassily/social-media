const UPLOAD_DIRS = {
  comments: "./client/public/uploads/comments",
  posts: "./client/public/uploads/posts"
};

const FILE_CONFIG = {
  maxSize: 3 * 1024 * 1024, // 3Mo max
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif"]
};

// Vérifier le type de fichier
const isValidFileType = (mimetype) => {
  return FILE_CONFIG.allowedTypes.includes(mimetype);
};

// Configuration Multer
const multerConfig = {
  limits: {
    fileSize: FILE_CONFIG.maxSize
  },
  fileFilter: (req, file, cb) => {
    if (isValidFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Format non supporté. Seuls les formats JPEG, JPG, PNG et GIF sont acceptés"
        ),
        false
      );
    }
  }
};

module.exports = {
  UPLOAD_DIRS,
  FILE_CONFIG,
  isValidFileType,
  multerConfig
}; 