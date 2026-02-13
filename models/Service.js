const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true, // URL or Icon class name
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
