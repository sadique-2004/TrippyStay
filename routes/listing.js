const express = require("express");
// creating new router object
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validateListing } = require("../middleware.js");



// Index rought
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

// new rought
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");

});

// show rought
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing !");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
    
})
);

// create route   
router.post("/",
    validateListing,
    isLoggedIn,
    wrapAsync(async (req, res, next) => {
        console.log("Request Body:", req.body);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("sucess", "Your listing has been successfully added !");
        res.redirect("/listings");
    })
);

// edit rought
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Cannot find that listing !");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);

// update rought
router.put("/:id",
    validateListing,
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {

        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("sucess", "Listing has been successfully Updated !");
        res.redirect(`/listings/${id}`);
    }));

// delete rought
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("sucess", "Listing has been successfully Deleted !");
        res.redirect("/listings");
    })
);

module.exports = router;

