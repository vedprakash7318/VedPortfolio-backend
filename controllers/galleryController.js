const asyncHandler = require('express-async-handler');
const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGallery = asyncHandler(async (req, res) => {
    const gallery = await Gallery.find({});
    res.json(gallery);
});

// @desc    Add image to gallery
// @route   POST /api/gallery
// @access  Private/Admin
const addGalleryItem = asyncHandler(async (req, res) => {
    const { title, category } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
        res.status(400);
        throw new Error('No image file provided');
    }

    // Determine type based on file mimetype
    const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const galleryItem = new Gallery({
        title,
        category,
        image,
        type,
    });

    const createdItem = await galleryItem.save();
    res.status(201).json(createdItem);
});

const { deleteFile, extractPublicId } = require('../utils/cloudinary');

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);

    if (item) {
        if (item.image) {
            const publicId = extractPublicId(item.image);
            await deleteFile(publicId);
        }
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

module.exports = {
    getGallery,
    addGalleryItem,
    deleteGalleryItem,
};
