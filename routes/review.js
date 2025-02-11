const express = require("express");
const router = express.Router({ mergeParams: true });   //restructoring the review router to merge the params
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn } = require("../middleware.js");





// Post Reviews route
router.post("/", 
    validateReview,
    isLoggedIn,
    wrapAsync(async (req, res) => {
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

    }));

// Delete reviews route
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {

        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("sucess", "Review Deleted!");

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;