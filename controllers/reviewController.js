const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ isApproved: true });
    res.json(reviews);
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({});
    res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
const createReview = asyncHandler(async (req, res) => {
    const { name, rating, comment } = req.body;

    const review = new Review({
        name,
        rating,
        comment,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
});

// @desc    Approve/Reject review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const toggleReviewApproval = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (review) {
        review.isApproved = !review.isApproved;
        const updatedReview = await review.save();
        res.json(updatedReview);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (review) {
        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

module.exports = {
    getApprovedReviews,
    getAllReviews,
    createReview,
    toggleReviewApproval,
    deleteReview,
};
