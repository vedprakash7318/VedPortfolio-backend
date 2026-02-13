const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');
const { cloudinary } = require('../utils/cloudinary');

// @desc    Get settings (Profile info)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    // Return the first settings document, or create default if none
    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create({
            bio: 'I transform ideas into high-performance web applications.',
            email: 'contact@example.com',
        });
    }

    res.json(settings);
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (!settings) {
        settings = new Settings();
    }

    const {
        heroTitle, heroSubtitle, bio, whatsapp,
        github, linkedin, twitter, email, phone, footerText
    } = req.body;

    // Handle File Uploads
    if (req.files) {
        if (req.files.resume) {
            // Delete old resume if exists
            if (settings.resumeLink) {
                const publicId = settings.resumeLink.split('/').slice(-1)[0].split('.')[0];
                const folder = 'portfolio/settings/';
                await cloudinary.uploader.destroy(folder + publicId, { resource_type: 'raw' }); // resume is likely raw/auto
                // Note: If resource_type was auto/image, destroy might need different params. 
                // However, splitting URL is brittle. Ideally we store public_id. 
                // For now, let's try a safer extraction or catch errors.
                try {
                    // specific extraction for portfolio/settings structure
                    const parts = settings.resumeLink.split('/');
                    const filename = parts[parts.length - 1];
                    const id = filename.split('.')[0];
                    await cloudinary.uploader.destroy(`portfolio/settings/${id}`);
                } catch (e) {
                    console.log("Error deleting old resume:", e);
                }
            }
            settings.resumeLink = req.files.resume[0].path;
        }
        if (req.files.profileImage) {
            // Delete old profile image
            if (settings.profileImage) {
                try {
                    const parts = settings.profileImage.split('/');
                    const filename = parts[parts.length - 1];
                    const id = filename.split('.')[0];
                    await cloudinary.uploader.destroy(`portfolio/settings/${id}`);
                } catch (e) {
                    console.log("Error deleting old profile image:", e);
                }
            }
            settings.profileImage = req.files.profileImage[0].path;
        }
    }

    // Update text fields if provided (check against undefined to allow emptying if needed, roughly)
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (bio !== undefined) settings.bio = bio;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (github !== undefined) settings.github = github;
    if (linkedin !== undefined) settings.linkedin = linkedin;
    if (twitter !== undefined) settings.twitter = twitter;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (footerText !== undefined) settings.footerText = footerText;

    // Allow manual URL overrides if sent as text (e.g. from existing value)
    if (req.body.resumeLink && !req.files?.resume) settings.resumeLink = req.body.resumeLink;
    if (req.body.profileImage && !req.files?.profileImage) settings.profileImage = req.body.profileImage;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
});

module.exports = {
    getSettings,
    updateSettings,
};
