const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utils/cloudinary');

// Config for Resume Upload (PDF) and potentially Profile Image
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio/settings',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allow PDF for resume
        resource_type: 'auto', // Important for PDFs (raw/auto)
    },
});

const upload = multer({ storage: storage });

router.route('/')
    .get(getSettings)
    .put(protect, admin, upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }]), updateSettings);

module.exports = router;
