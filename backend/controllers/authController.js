const User = require("../models/User");
const Product = require("../models/Product");
const TUsers = require("../models/Tusers");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

dotenv.config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // or another service like 'yahoo'
  auth: {
    user: process.env.USER, // Your email address
    pass: process.env.USER_PASS, // Your email password (use app password for Gmail)
  },
});

// Route to send a welcome email
const sendEmail = async (req, res) => {
  const { email, name } = req.body; // Assuming you want to personalize the email with a name.

  const mailOptions = {
    from: process.env.User,
    to: email,
    subject: "Welcome to Our Service",
    text: `Hello ${
      name || "User"
    },\n\nThank you for signing up with us! We're thrilled to have you on board.\nExplore amazing rental opportunities and find your perfect home with ease.\nVisit us at https://cityrentals.site\n\nBest Regards,\nCity Rentals Team`,
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <header style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>Welcome to City Rentals</h1>
            </header>
            <div style="padding: 20px;">
              <h2>Hello ${name || "User"},</h2>
              <p>Thank you for signing up with us! We're thrilled to have you on board.</p>
              <p>Explore amazing rental opportunities and find your perfect home with ease.</p>
              <a href="https://cityrentals.site" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Visit Our Website</a>
            </div>
            <footer style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #666;">
              <p>&copy; 2024 City Rentals. All rights reserved.</p>
              <p>
                <a href="https://cityrentals.site/privacy-policy" style="color: #4CAF50; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://cityrentals.site/contact" style="color: #4CAF50; text-decoration: none;">Contact Us</a>
              </p>
            </footer>
          </div>
        </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending email" });
    }
    res.status(200).json({ message: "Welcome email sent successfully" });
  });
};

/// Utility function to generate a random license ID
const generateLicenseId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let licenseId = "";
  for (let i = 0; i < 12; i++) {
    licenseId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return licenseId;
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const licenseId = generateLicenseId(); // Generate license ID

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      licenseId, // Save license ID to the database
    });

    // Dynamically create a database for the user
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = await mongoose.createConnection(userDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Add a dummy product to the newly created database
    const ProductModel = userDB.model("Product", Product.schema); // Use Product schema in the user-specific DB

    const dummyProduct = new ProductModel({
      product_name: "Dummy Product",
      mrp: 100, // Example MRP
      gst_rate: 18, // Example GST rate (either 12 or 18)
      barcode_number: "1234567890123", // Example barcode number
    });

    // Save the dummy product in the user's specific database
    await dummyProduct.save();

    res
      .status(201)
      .json({ message: "User registered successfully", licenseId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password, licenseId } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.licenseId !== licenseId) {
      return res.status(400).json({ message: "Invalid license ID" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, licenseId: user.licenseId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Connect to the user's specific database
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = await mongoose.createConnection(userDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, licenseId: user.licenseId },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Route to add a new product
const addProduct = async (req, res) => {
  const { product_name, mrp, gst_rate, barcode_number } = req.body;
  const { licenseId } = req.user;

  try {
    // Validate input data
    if (!product_name || !mrp || !gst_rate || !barcode_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Connect to the user's database dynamically
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = await mongoose.createConnection(userDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create the Product model for the specific user database
    const ProductModel = userDB.model('Product', Product.schema);

    // Create a new product instance
    const newProduct = new ProductModel({
      product_name,
      mrp,
      gst_rate,
      barcode_number,
    });

    // Save the product to the database
    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

//get prodcut
const getProduct = async (req, res) => {
  const { licenseId } = req.user; // Assuming the licenseId is in the user object (from JWT token or session)
  const barcode = req.params.barcode;
  try {
    // Connect to the user's database dynamically
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = await mongoose.createConnection(userDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create the Product model for the specific user database
    const ProductModel = userDB.model('Product', Product.schema);

    // Query the product based on barcode_number
    const product = await ProductModel.findOne({ barcode_number: barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product details
    res.json({
      product_name: product.product_name,
      mrp: product.mrp,
      gst_rate: product.gst_rate,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//getting all data
const getAllData = async (req, res) => {
  const { licenseId } = req.user; // Assuming the licenseId is in the user object (from JWT token or session)
  try {
    // Connect to the user's database dynamically
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = await mongoose.createConnection(userDBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create the Product model for the specific user database
    const ProductModel = userDB.model('Product', Product.schema);

    // Get all products for the user
    const products = await ProductModel.find();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

const fullName = async (req, res) => {
  const { licenseId } = req.params;

  try {
    // Fetch user based on licenseId
    const user = await User.findOne({ licenseId }).lean();

    if (user) {
      // Return the fullName if user exists
      return res.status(200).json({
        fullName: user.fullName,
      });
    } else {
      // User not found
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new user
const TNewUsers = async (req, res) => {
  try {
    const user = new TUsers({ ...req.body, licenseId: req.user.licenseId });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Add a transaction
const newTransaction = async (req, res) => {
  try {
    const user = await TUsers.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.transactions.push(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const TAllUsers = async (req, res) => {
  try {
    const users = await TUsers.find({ licenseId: req.licenseId });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { userId, index } = req.params;
    const transactionIndex = parseInt(index);

    // Validate index
    if (isNaN(transactionIndex)) {
      return res.status(400).json({ message: "Invalid transaction index" });
    }

    // Find the user by ID and licenseId
    const user = await TUsers.findOne({ _id: userId, licenseId: req.licenseId });

    if (!user) {
      return res.status(404).json({ message: "User not found or unauthorized" });
    }

    // Check if the transactions array exists and is an array
    if (!Array.isArray(user.transactions)) {
      return res.status(400).json({ message: "No transactions found" });
    }

    // Ensure the transactionIndex is valid
    if (transactionIndex < 0 || transactionIndex >= user.transactions.length) {
      return res.status(400).json({ message: "Invalid transaction index" });
    }

    // Remove the transaction using splice
    const deletedTransaction = user.transactions.splice(transactionIndex, 1);

    // Save the updated user document
    await user.save();

    // Respond with the deleted transaction
    res.status(200).json({
      message: "Transaction deleted successfully",
      deletedTransaction: deletedTransaction[0], // Return the deleted transaction
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the transaction" });
  }
};

// DELETE User - API endpoint
const deleteTuser = async (req, res) => {
  try {
    const { userId } = req.params;
    const licenseId = req.licenseId;  // Retrieve licenseId from the request

    if (!licenseId) {
      return res.status(400).json({ message: "License ID is missing" });
    }

    // Find and delete the user by ID and licenseId
    const user = await TUsers.findOneAndDelete({
      _id: userId,
      licenseId: req.licenseId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found or unauthorized" });
    }

    // Respond with a success message
    res.status(200).json({ message: "User deleted successfully", userId: user._id });
  } catch (err) {
    // Log the error
    console.error('Error in deleteTuser:', err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendEmail,
  addProduct,
  getProduct,
  getAllData,
  fullName,
  TNewUsers,
  newTransaction,
  TAllUsers,
  deleteTransaction,
  deleteTuser,
};
