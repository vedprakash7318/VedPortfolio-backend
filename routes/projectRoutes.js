const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');

const { protect, admin } = require('../middleware/authMiddleware');
const parser = require('../config/cloudinary');

router.route('/')
    .get(getProjects)
    .post(protect, admin, parser.single('image'), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, parser.single('image'), updateProject)
    .delete(protect, admin, deleteProject);

module.exports = router;
