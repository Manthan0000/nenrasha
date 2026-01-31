const multer = require('multer');

// Use memory storage to keep file in buffer for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
