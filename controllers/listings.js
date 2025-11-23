const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
  // Extract filter parameters from query string
  const { minPrice, maxPrice, minRating, location, country } = req.query;

  // Build filter object for MongoDB query
  let filter = {};

  // Price filtering
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Location filtering (case-insensitive regex search)
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  // Country filtering (case-insensitive regex search)
  if (country) {
    filter.country = { $regex: country, $options: "i" };
  }

  // Fetch listings with filters and populate reviews for rating calculation
  let allListings = await Listing.find(filter).populate("reviews");

  // Filter by rating if minRating is specified
  if (minRating) {
    const minRatingNum = Number(minRating);
    allListings = allListings.filter((listing) => {
      const avgRating = listing.averageRating;
      return avgRating >= minRatingNum;
    });
  }

  // Pass filters to view for displaying active filters
  res.render("listings/index.ejs", {
    allListings,
    filters: { minPrice, maxPrice, minRating, location, country },
  });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user); // user object created while deserializing , when user is logged in through passport.
  // authetication code , that shifted in middleware.
  // console.log("Create route is being rendering.");
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params; // app.use(express.urlextende(extended : true)) krna hoga to parse.
  console.log("Id is", id);
  // const listing = await Listing.findById(id);
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner"); // we are using populate as our listing[reviews] is using a reference id of array
  // we also need to populate author name inside reviews, so we will populate object in place of just reviews

  // console.log(listing);
  if (!listing) {
    // console.log("We not have listing with this name")
    req.flash("error", "Listing you requested, does not exist!"); // putting flash in error key array

    return res.redirect("/listings");
    // console.log("We not have listing with this name after redirect")
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // try{
  //     // Method 1
  //         // let {title , description , image , price , country , location } = req.body;
  //     // Method 2 --> form me object bna lena
  //     let listingObj = req.body.listing;
  //     //    console.log(listingObj);
  //     const newListing = new Listing(listingObj);
  //     await newListing.save();
  //     res.redirect("/listings");
  // }catch(err){
  //     next(err); // if err come call err handler
  // }
  // Method 1
  // let {title , description , image , price , country , location } = req.body;
  // Method 2 --> form me object bna lena

  // let listingObj = req.body.listing;
  // if(!listingObj){ // done by Joi
  //     throw new ExpressError(400 , "Send Valid Data for Listing!");
  // }
  // solving scema validation problem , whensend by post request through hoopscotch , where our form required is overpassed/
  // * better soluttion is to use joi tool, jo hum if lega ke kr rhe hi , use joi bhut easily kr deta hi
  // if(!listingObj.description){ // similar for other.
  //     throw new ExpressError(400 , "Send Valid Data for Listing!");
  // }
  // ? Soltuion of validation using Joi
  // validate listing is passed as middleware
  // try{

  let url = req.file.path; // req.file is coming after multer
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  // console.log("New : " , newListing);
  // console.log(req.user);
  newListing.owner = req.user._id; // storing id of current user in newListing
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
  // }catch(err){
  //     console.log("Error is coming form not saving data.");
  // }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    // console.log("We not have listing with this name")
    req.flash("error", "Listing you requested, does not exist!"); // putting flash in error key array

    return res.redirect("/listings");
    // console.log("We not have listing with this name after redirect")
  }

  // adding preview feature , by changing url with cloudinary api
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // changing and storing in temporary place .

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid Data for Listing!");
  }

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // updating body items , not file jo multer se aa rhi hi.
  // we are passing each attribute as user ne koi bhi change kiya ho sakta hi.
  // ref to phase1 notes about destructing
  // console.log("put" , req.body.listing);

  //* after updating bodily item , now we are updating file item.
  if (typeof req.file !== undefined) {
    let url = req.file.path; // req.file is coming after multer
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`); // redirecting too show route
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id); // ? humne post mongoose middleware schema lagaya hi iske upar(listing.js)
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
