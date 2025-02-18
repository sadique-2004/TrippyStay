const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.giveReview = async (req, res) => {
    console.log(req.body); // { review: { rating: '5', body: 'This is a review' } }
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New review is saved");
    req.flash("sucess", "New Review Created !");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review Deleted!");

    res.redirect(`/listings/${id}`);
}