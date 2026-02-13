const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    heroTitle: { type: String, default: 'Digital Experiences' },
    heroSubtitle: { type: String, default: 'Full Stack Developer specializing in building exceptional digital products.' },
    bio: { type: String },
    resumeLink: { type: String },
    whatsapp: { type: String },
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    email: { type: String },
    phone: { type: String },
    profileImage: { type: String },
    roles: { type: String, default: 'Frontend Developer, Backend Developer, Full Stack Developer' },
    footerText: { type: String, default: 'Let\'s Build Something Amazing' },
}, {
    timestamps: true,
});

// Convert to singleton pattern logic in controller (always fetch the first one)
module.exports = mongoose.model('Settings', settingsSchema);
