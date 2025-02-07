const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret: 'my-super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000  , // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucess = req.flash('sucess');
    res.locals.error = req.flash('error');
    next(); //  next is used to pass control to the next middleware function
})


app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

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


app.listen(3000, () => {
    console.log("App is listening on post 3000");
});