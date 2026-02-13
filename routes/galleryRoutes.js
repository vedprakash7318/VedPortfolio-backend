const express = require('express');
const router = express.Router();
const {
    getGallery,
    addGalleryItem,
    deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');
const parser = require('../config/cloudinary');

router.route('/')
    .get(getGallery)
    .post(protect, admin, parser.single('image'), addGalleryItem);

router.route('/:id')
    .delete(protect, admin, deleteGalleryItem);

module.exports = router;
