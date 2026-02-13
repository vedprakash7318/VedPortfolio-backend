const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({});
    res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        res.json(project);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
    const { title, description, liveLink, githubLink, category } = req.body;
    let { tags, images } = req.body;

    // Handle specific fields that might come as strings from FormData
    if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
    }
    // Handle images array (if implemented as multi-upload later, for now keep simple)

    const image = req.file ? req.file.path : req.body.image;

    const project = new Project({
        title,
        description,
        tags,
        image,
        images,
        liveLink,
        githubLink,
        category,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
    const { title, description, liveLink, githubLink, category } = req.body;
    let { tags, images } = req.body;

    if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
    }

    const project = await Project.findById(req.params.id);

    if (project) {
        project.title = title || project.title;
        project.description = description || project.description;
        project.tags = tags || project.tags;

        if (req.file) {
            project.image = req.file.path;
        } else if (req.body.image) {
            project.image = req.body.image;
        }

        project.images = images || project.images;
        project.liveLink = liveLink || project.liveLink;
        project.githubLink = githubLink || project.githubLink;
        project.category = category || project.category;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const { deleteFile, extractPublicId } = require('../utils/cloudinary');

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.image) {
            // Try to use stored public_id if we added it, or extract from URL
            // Since we haven't migrated DB, we rely on extraction or filename if available
            // Ideally, req.file.filename from multer storage IS the public_id.
            // But we only stored req.file.path (url) in DB.
            const publicId = extractPublicId(project.image);
            await deleteFile(publicId);
        }
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
