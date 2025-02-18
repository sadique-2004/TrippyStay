if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// let mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const DB_URL = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", function (error) {
    console.log("Session Store Error in mongo", error);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JS from accessing the cookie
    },
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.sucess = req.flash('sucess');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;  // Passing the current user to all templates for display purposes
    next(); //  next is used to pass control to the next middleware function
})
// console.log(dburl);

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(DB_URL);
};

/*==========================================================================================================*/

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.get("/privacy", (req, res) => {
    res.render("listings/privacy-policy.ejs");
});
app.get("/terms", (req, res) => {
    res.render("listings/terms.ejs");
});


//  All route for listing, review, user signup
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

/*==========================================    ERROR HANDLING     ============================================*/
/*=============================================================================================================*/

// Catch-all route for undefined endpoints
app.use("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).render("listings/error404.ejs", { message });

});


app.listen(3000, () => {
    console.log("App is listening on post 3000");
});