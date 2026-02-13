const asyncHandler = require('express-async-handler');
const Experience = require('../models/Experience');

// @desc    Get all experience
// @route   GET /api/experience
// @access  Public
const getExperience = asyncHandler(async (req, res) => {
    // Sort by creation date descending (Newest added first)
    const experience = await Experience.find({}).sort({ createdAt: -1 });
    res.json(experience);
});

// @desc    Create experience
// @route   POST /api/experience
// @access  Private/Admin
const createExperience = asyncHandler(async (req, res) => {
    const { jobTitle, company, duration, year, description } = req.body;

    const experience = new Experience({
        jobTitle,
        company,
        duration,
        year,
        description,
    });

    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
});

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private/Admin
const deleteExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);

    if (experience) {
        await experience.deleteOne();
        res.json({ message: 'Experience removed' });
    } else {
        res.status(404);
        throw new Error('Experience not found');
    }
});

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private/Admin
const updateExperience = asyncHandler(async (req, res) => {
    const { jobTitle, company, duration, year, description } = req.body;

    const experience = await Experience.findById(req.params.id);

    if (experience) {
        experience.jobTitle = jobTitle || experience.jobTitle;
        experience.company = company || experience.company;
        experience.duration = duration || experience.duration;
        experience.year = year || experience.year;
        experience.description = description || experience.description;

        const updatedExperience = await experience.save();
        res.json(updatedExperience);
    } else {
        res.status(404);
        throw new Error('Experience not found');
    }
});

module.exports = {
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
};
