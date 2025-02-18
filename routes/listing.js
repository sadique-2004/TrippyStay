const express = require("express");
// creating new router object
const router = express.Router();
const Listing = require("../models/listing.js");            //means first we go to the root directory then search for the file 
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const { renderNewForm, index, showListing, createListing, renderEditForm, updateListing, destroyListing } = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');

const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(index))
    .post( 
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(createListing)
    );



// new rought
router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id")
    .get(wrapAsync(showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(destroyListing)
    );


// edit rought
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(renderEditForm)
);


module.exports = router;

