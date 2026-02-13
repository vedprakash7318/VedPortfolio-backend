const express = require('express');
const router = express.Router();
const { getTechStack, addTechStack, deleteTechStack, toggleTechStackStatus, seedTechStack } = require('../controllers/techStackController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio/techstack',
        allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp'],
    },
});

const upload = multer({ storage: storage });

router.route('/')
    .get(getTechStack)
    .post(protect, admin, upload.single('icon'), addTechStack);

router.route('/seed')
    .post(protect, admin, seedTechStack);

router.route('/:id')
    .delete(protect, admin, deleteTechStack);

router.route('/:id/toggle')
    .put(protect, admin, toggleTechStackStatus);

module.exports = router;
