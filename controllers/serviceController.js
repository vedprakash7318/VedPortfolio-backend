const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    const services = await Service.find({});
    res.json(services);
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
    const { title, description, icon } = req.body;

    const service = new Service({
        title,
        description,
        icon,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
});

const { deleteFile, extractPublicId } = require('../utils/cloudinary');

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (service) {
        if (service.icon) {
            // Assuming icon might be an image URL in future, though currently it's a class string. 
            // If user uses image for service icon later, this handles it. 
            // But based on model, icon is string. If they change to image upload, we need this.
            // For now, let's keep it safe. If it looks like a url...
            if (service.icon.startsWith('http')) {
                const publicId = extractPublicId(service.icon);
                await deleteFile(publicId);
            }
        }
        await service.deleteOne();
        res.json({ message: 'Service removed' });
    } else {
        res.status(404);
        throw new Error('Service not found');
    }
});

module.exports = {
    getServices,
    createService,
    deleteService,
};
