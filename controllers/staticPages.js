const Listing = require("../models/listing.js");

module.exports.renderHome = async (req, res) => {
    // const featuredListings = await Listing.find({}).limit(6);
    const featuredListings = await Listing.find({})
      .sort({ rating: -1 })
      .limit(6);
    res.render("home.ejs", { featuredListings });
};


module.exports.renderAbout = (req, res) => {
    res.render("static/about");
};

module.exports.renderContact = (req, res) => {
    res.render("static/contact");
};

module.exports.renderServices = (req, res) => {
    res.render("static/services");
};

module.exports.renderFAQs = (req, res) => {
    res.render("static/faqs");
};

module.exports.renderTerms = (req, res) => {
    res.render("static/terms");
};

module.exports.renderPrivacy = (req, res) => {
    res.render("static/privacy");
};
