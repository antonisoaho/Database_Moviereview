const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const { userId } = req.user;
  try {
    const newReview = new Review({ movieId, userId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const updates = req.body;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId.toString() !== userId && role !== 'admin')
      return res.status(403).json({ error: 'Access denied' });

    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId.toString() !== userId && role !== 'admin')
      return res.status(403).json({ error: 'Access denied' });

    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
