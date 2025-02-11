const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup",
    wrapAsync,
    (async (req, res, next) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ username, email });
            const registredUser = await User.register(newUser, password);
            console.log(registredUser);
            // automaticalley Log the user in after registering the new user  with the passport middleware and redirect to the listings page
            req.login(registredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("sucess", `🎉 Hey ${username}, welcome to TrippyStay! Get ready for an amazing journey ahead.`);
                res.redirect("/listings");
            })

        } catch (err) {
            req.flash("error", `Oops! 🚨 ${err.message}`);
            res.redirect("/signup");
        }

    }));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("sucess", `🎉 Welcome back, ${req.user.username}! We've saved your seat. Let's explore again.`);
        res.redirect(res.locals.redirectUrl || "/listings");
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("sucess", "👋 You’ve logged out successfully! See you soon for your next adventure.");
        res.redirect("/listings");
    })
})
module.exports = router;

