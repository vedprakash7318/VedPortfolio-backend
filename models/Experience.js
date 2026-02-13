const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true, // e.g. "Jan 2023 - Present"
    },
    year: {
        type: String,
        required: true, // For timeline sorting
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Experience', experienceSchema);
