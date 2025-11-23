const mongoose = require("mongoose");
const Schema = mongoose.Schema; // jisse ab humhe baar baar mongoose.schemanhi likhna hoga
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      set: function (v) {
        return v === ""
          ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v;
      },
    },
    filename: {
      type: String, // later jab humhe person image upload krega , to clodinary se hum connect krke us pr image send krenge , wha se humhe file attribute me filename mil jayega
      default: "ListingFile",
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    // review is array of object , object consisting one key-value pair.
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Virtual field for calculating average rating
listingSchema.virtual("averageRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;

  // If reviews are populated with actual review objects
  if (this.reviews[0] && this.reviews[0].rating) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
  }

  return 0;
});

// Add indexes for better query performance
listingSchema.index({ price: 1 });
listingSchema.index({ location: "text", country: "text" });

// post mongoose middleware
// find one and delete ko fond by id and update or any , bhi call krta hi internally
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); // listing.reviews ka array bnao , jahha bhi _id match kre delete kr do
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
