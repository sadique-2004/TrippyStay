const Listing = require("../models/listing");

// How It Works search bar
// Checks if a location is provided in the query (req.query.location).
// Uses MongoDB regex ($regex) to perform a case-insensitive search.
// If a location is found, it filters the listings. Otherwise, it returns all listings.
// Passes listings and location to the template (index.ejs).

module.exports.index = async (req, res) => {
    let { location } = req.query;

    let query = {}; // default get all listings 
    if (location) {
        query.location = { $regex: location, $options: "i" }; // Case-insensitive search
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, location });
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("sucess", "Your listing has been successfully added !");
    res.redirect("/listings");
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing !");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing, user: req.user || null });
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Cannot find that listing !");
        return res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage = originalImage.replace("upload", "upload/w_100,h_100,c_thumb,g_face,r_max");
    res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(listing);

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("sucess", "Listing has been successfully Updated !");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("sucess", "Listing has been successfully Deleted !");
    res.redirect("/listings");
}