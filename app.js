const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");


let mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_URL);
};


// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join("");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join("");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index rought
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

// new rought
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show rought
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
})
);

// create route   
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

// edit rought
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
);

// update rought
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete rought
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// Post Reviews route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New review is saved");
    res.redirect(`/listings/${listing._id}`);

}));

// Delete reviews route
app.delete("/listings/:id/reviews/:reviewId",
    wrapAsync(async (req, res) => {

        let {id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);

// app.post("/listings/:id/reviews", async (req, res) => {
//     try {
//         // Check that `comment` and `rating` are present in the request body
//         const { comment, rating } = req.body.review;

//         if (!comment || !rating) {
//             return res.status(400).send("Comment and rating are required.");
//         }

//         // Find the listing by ID
//         let listing = await Listing.findById(req.params.id);
//         if (!listing) {
//             return res.status(404).send("Listing not found.");
//         }

//         // Create the new review
//         let newReview = new Review({ comment, rating });

//         // Add review to listing's reviews array
//         listing.reviews.push(newReview);

//         // Save the new review and the listing
//         await newReview.save();
//         await listing.save();

//         console.log("New review is saved");
//         res.send("New review is saved");
//     } catch (error) {
//         console.error("Error saving review:", error);
//         res.status(500).send("Internal server error");
//     }
// });



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// Catch-all route for undefined endpoints
app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found")); // Passing error to error-handling middleware
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err; // Set default values
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("app is listining on port 8080");
});