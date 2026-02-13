const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
    const { name, email, message, phone } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    const contact = await Contact.create({
        name,
        email,
        message,
        phone
    });

    res.status(201).json(contact);
});

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
});

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        await contact.deleteOne();
        res.json({ message: 'Message removed' });
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

module.exports = {
    submitContact,
    getContacts,
    deleteContact,
};
