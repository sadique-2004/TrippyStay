const express = require("express");
const router = express.Router({ mergeParams: true });   //restructoring the review router to merge the params
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const { giveReview, destroyReview } = require("../controllers/reviews.js");

// Post Reviews route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(giveReview));

// Delete reviews route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(destroyReview)
);

module.exports = router;