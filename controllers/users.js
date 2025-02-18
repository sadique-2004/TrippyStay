const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
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
            req.flash("sucess", `🎉 Hey <strong>${username}</strong> welcome to TrippyStay! Get ready for an amazing journey ahead.`);
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", `Oops! 🚨 ${err.message}`);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("sucess", `🎉 Welcome back, <strong>${req.user.username}</strong> ! We've saved your seat. Let's explore again.`);
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("sucess", "👋 You’ve logged out successfully! See you soon for your next adventure.");
        res.redirect("/listings");
    })
}