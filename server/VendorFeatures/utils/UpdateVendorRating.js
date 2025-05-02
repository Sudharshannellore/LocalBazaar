const Review = require('../models/Review');
const Vendor = require('../models/Vendor');

async function updateVendorRating(vendorId) {
  const reviews = await Review.find({ vendor: vendorId });
  if (reviews.length === 0) {
    await Vendor.findByIdAndUpdate(vendorId, {
      averageRating: 0,
      totalReviews: 0
    });
    return;
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total / reviews.length;

  await Vendor.findByIdAndUpdate(vendorId, {
    averageRating: average.toFixed(1),
    totalReviews: reviews.length
  });
}

module.exports = updateVendorRating;
