if (process.env.NODE_ENV != "production") {
  // .env file hum sirf developmental phase ke ander hi use krte hi.
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require('./schema.js'); //  this is for JOI server side validation
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // for storing mongo session on online cloud, as express-session only do in local.
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js"); // router
const reviewRouter = require("./routes/review.js"); // router
const userRouter = require("./routes/user.js"); // router

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // to use ejs for creating boilerplate
app.use(express.static(path.join(__dirname, "/public"))); // to use static files.

// ========== DATABASE CONFIGURATION ==========

// // Option 1: Local Development Only (Currently Active)
// const MONGO_URL = "mongodb://127.0.0.1:27017/airmojo";
// const dbUrl = MONGO_URL;

// Option 2: Production Only (Uncomment for production deployment)
// const dbUrl = process.env.ATLASDB_URL;

// Option 3: Auto-switch (Uses production if ATLASDB_URL exists, else local)
const MONGO_URL = "mongodb://127.0.0.1:27017/airmojo";
const dbUrl = process.env.ATLASDB_URL || MONGO_URL;

// ==========================================

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch((err) => console.log(err));

//! method override
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touch: 24 * 3600, // default on every refresh session update.
  // ttl is default set to 14 days.
});

store.on("error", (err) => {
  console.log("Error in Mongo session ", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days to expire from now.
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // saves from cross crypting attack
  },
};

// app.get("/" , (req , res) => {
//     console.log("hi ,  I am root.");
//     res.send("Home page");
// })

app.use(session(sessionOptions)); // using session middleware
app.use(flash());

//! using passport
app.use(passport.initialize()); // hr ek request ke liye passport ko initialize kro.
app.use(passport.session()); // for login one time in one session.
passport.use(new LocalStrategy(User.authenticate())); // passport ke ander humne jo bhi nayi local strategy create ki hi , wo sabhi autheticat hone chahiye through LocalStrategy , wo kaise autheticate honne , through User.authenticate() , jo passport local-mongosse ne add kiya hi.

passport.serializeUser(User.serializeUser()); // for seliazing the method , he is using his static method.
// storing the user info in session.
passport.deserializeUser(User.deserializeUser());
// removing stored information

app.use((req, res, next) => {
  // we can access res.locals in navbar.ejs also
  res.locals.success = req.flash("success"); // defining middleware , as the msg is stored in temporary session , when we calls the post, and now it is used in variable , and temporary storage of session is created, while redirecting this line executes , and flash msg works.
  res.locals.error = req.flash("error"); // defining middleware , as the msg is stored in temporary session , when we calls the post, and now it is used in variable , and temporary storage of session is created, while redirecting this line executes , and flash msg works.
  // console.log("error12 : " , res.locals.error); // succcess is a array on console we get about it
  res.locals.currUser = req.user; // storing user session info
  next();
});

// app.get("/demouser" , async(req , res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student",
//     });

//     let registeredUser =    await User.register(fakeUser , "helloworld"); // second argument inside static function register is password.  , also check for a unique users.
//         // passport already has implemented the logic for register.
//     res.send(registeredUser);
// })

// ! Using Express Router
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ! sending page not found response for all other routes that are not defined above.
// * means sabse match ho jayega. --> ise wild card matching kehte hi.
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// 404 handler - should be AFTER all defined routes but BEFORE the error handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  console.log("After wrap asyn.");
  const { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}.`);
});
