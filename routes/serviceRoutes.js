const express = require('express');
const router = express.Router();
const {
    getServices,
    createService,
    deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getServices)
    .post(protect, admin, createService);

router.route('/:id')
    .delete(protect, admin, deleteService);

module.exports = router;
