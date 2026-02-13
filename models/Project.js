const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
        }
    ],
    image: {
        type: String,
        required: true, // Cloudinary URL
    },
    images: [
        {
            type: String, // Additional images for slider
        }
    ],
    liveLink: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    category: {
        type: String, // e.g., 'Web App', 'Mobile App'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
