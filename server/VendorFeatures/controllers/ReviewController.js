const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const vendorId  = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.userId; // assuming you're using auth middleware


    const review = new Review({
      vendor: vendorId,
      user: userId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.id });

    res.status(200).json( reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err });
  }
};



