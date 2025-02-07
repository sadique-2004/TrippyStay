const express = require("express");
// creating new router object
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join("");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index rought
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

// new rought
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show rought
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Cannot find that listing !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})
);

// create route   
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("sucess", "Your listing has been successfully added !");
    res.redirect("/listings");
})
);

// edit rought
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
})
);

// update rought
router.put("/:id", validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete rought
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("sucess", "Listing has been successfully Deleted !");
    res.redirect("/listings");
  })
);

module.exports = router;

