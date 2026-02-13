const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true, // e.g., 'Certificate', 'Workshop', 'Award'
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Gallery', gallerySchema);
