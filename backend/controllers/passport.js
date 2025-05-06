const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User"); // Adjust path
const Product = require("../models/Product"); // Adjust path
const generateLicenseId = require("./authController").generateLicenseId; // Your function
const bcrypt = require("bcrypt");
dotenv.config();

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // 8-char random string
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          // Create user if not exists
          const randomPassword = generateRandomPassword();

          // Optional: hash the random password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(randomPassword, salt);

          const licenseId = generateLicenseId();

          user = new User({
            name: profile.displayName,
            email,
            password: hashedPassword, // Google users may not need local passwords
            licenseId,
          });

          await user.save();

          // Dynamically create DB and add dummy product (optional)
          const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
          const userDB = await mongoose.createConnection(userDBURI, {});
          const ProductModel = userDB.model("Product", Product.schema);

          const dummyProduct = new ProductModel({
            product_name: "Dummy Product",
            mrp: 100,
            gst_rate: 18,
            barcode_number: "1234567890123",
          });

          await dummyProduct.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize/Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
