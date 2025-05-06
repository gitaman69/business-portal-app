const User = require("../models/User");
const Product = require("../models/Product");
const {connectDB} = require("../config/db");
const {connections} = require("../config/db");
const { disconnectDB } = require("../config/db");
const TUsers = require("../models/Tusers");
const BillData = require("../models/billData");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const BankAccount = require("../models/BankAccount");
const PaymentMode = require("../models/PaymentMode");
const Transaction = require("../models/Transaction");

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
    from: process.env.USER,
    to: email,
    subject: "Welcome to BillGram",
    text: `Hello ${name || "User"},
  
  Thank you for joining BillGram! Managing your expenses and tracking your finances has never been easier.
  
  With BillGram, you can:
  - Organize your expenses effortlessly.
  - Monitor all your transactions in one place.
  - Gain financial insights to make smarter decisions.
  
  Start your journey toward financial ease today!
  Visit us at https://business-portal-app.onrender.com
  
  Download the BillGram app: https://drive.google.com/file/d/1qrRs5mTX2hwPHH1sTvkkY4WXxE7clX28/view?usp=drive_link
  Log in to your account: https://business-portal-app.onrender.com/login
  
  Best Regards,
  The BillGram Team`,
  
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <header style="background-color: #1E90FF; color: white; padding: 20px; text-align: center;">
              <h1>Welcome to BillGram</h1>
            </header>
            <div style="padding: 20px;">
              <h2>Hello ${name || "User"},</h2>
              <p>Thank you for joining BillGram! Managing your expenses and tracking your finances has never been easier.</p>
              <p>With BillGram, you can:</p>
              <ul style="padding-left: 20px;">
                <li>Organize your expenses effortlessly.</li>
                <li>Monitor all your transactions in one place.</li>
                <li>Gain financial insights to make smarter decisions.</li>
              </ul>
              <p>Start your journey toward financial ease today!</p>
              <a href="https://drive.google.com/file/d/1aVKqi-zhZrX3uaM1kRQA1K_9TX-1L0iD/view?usp=drive_link" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #1E90FF; color: white; text-decoration: none; border-radius: 4px;">Download App</a>
              <a href="https://business-portal-app.onrender.com/login" style="display: inline-block; margin-top: 20px; margin-left: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Log In</a>
            </div>
            <footer style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #666;">
              <p>&copy; 2025 BillGram. All rights reserved.</p>
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

// Feedback route
const sendFeedback = async (req, res) => {
  const { rating, comment } = req.body;

  // Validate input
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating. It must be a number between 1 and 5.' });
  }

  try {
    // Email content
    const mailOptions = {
      from: process.env.USER, // Sender's email
      to: process.env.USER, // Replace with recipient's email
      subject: 'New Feedback Received',
      html: `
        <h3>New Feedback Submission</h3>
        <p><strong>Rating:</strong> ${rating} stars</p>
        <p><strong>Comment:</strong> ${comment || 'No comment provided.'}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({ message: 'Feedback submitted and email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send feedback. Please try again later.' });
  }
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

    // Establish DB connection for the user
    await connectDB(licenseId);

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, licenseId: user.licenseId },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, licenseId: user.licenseId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Connect to user's DB
    await connectDB(user.licenseId);

    res.redirect(`${process.env.REACT_APP_BACKEND_URL}/login?token=${token}&licenseId=${user.licenseId}`);
  } catch (err) {
    res.status(500).json({ message: "Google auth failed", error: err.message });
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

    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];

    if (!userDB) {
        return res.status(500).json({ message: "Database connection not found" });
    }

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
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];

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
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];

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
        fullName: user.name,
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

// Route to add/store bill data under user-specific database
const addBillData = async (req, res) => {
  const { licenseId } = req.user; // Assuming the licenseId is available after authentication
  const { storeName, storeMail, storeContact, storeAddress } = req.body; // Bill data from request

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];

    // Create the BillData model for the specific user database
    const BillDataModel = userDB.model("BillData", BillData.schema);

    // Check if a bill data record already exists
    let existingBillData = await BillDataModel.findOne();

    if (existingBillData) {
      // Update the existing record
      existingBillData.storeName = storeName;
      existingBillData.storeMail = storeMail;
      existingBillData.storeContact = storeContact;
      existingBillData.storeAddress = storeAddress;

      // Save the updated data
      await existingBillData.save();

      res.status(200).json({
        message: "Bill data updated successfully",
        data: existingBillData,
      });
    } else {
      // Create a new bill data record (only if none exists)
      const newBillData = new BillDataModel({
        storeName,
        storeMail,
        storeContact,
        storeAddress,
      });

      // Save the new bill data to the database
      await newBillData.save();

      res
        .status(201)
        .json({ message: "Bill data added successfully", data: newBillData });
    }
  } catch (error) {
    console.error("Error adding or updating bill data:", error);
    res
      .status(500)
      .json({
        message: "Failed to add or update bill data",
        error: error.message,
      });
  }
};

// Route to get Bill Data for the authenticated user
const getBillData = async (req, res) => {
  const { licenseId } = req.user; // Assuming the licenseId is available after authentication

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];

    // Create the BillData model for the specific user database
    const BillDataModel = userDB.model("BillData", BillData.schema);

    // Get the bill data for the user
    const billData = await BillDataModel.find();

    res.status(200).json(billData);
  } catch (error) {
    console.error("Error fetching bill data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch bill data", error: error.message });
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

const addBankAccount = async (req, res) => {
  const { name, balance } = req.body;
  const { licenseId } = req.user; // Ensure `req.user` is populated from middleware like JWT

  if (!name || !balance) {
    return res.status(400).json({ message: 'Name and balance are required' });
  }

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const BankAccountModel = userDB.model('BankAccount', BankAccount.schema);

    const newAccount = new BankAccountModel({ name, balance });
    await newAccount.save();

    res.status(201).json({ message: 'Bank account added successfully', account: newAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error adding bank account', error: error.message });
  }
};

const addPaymentMode = async (req, res) => {
  const { name } = req.body;
  const { licenseId } = req.user;

  if (!name) {
    return res.status(400).json({ message: 'Payment mode name is required' });
  }

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const PaymentModeModel = userDB.model('PaymentMode', PaymentMode.schema);

    const newMode = new PaymentModeModel({ name });
    await newMode.save();

    res.status(201).json({ message: 'Payment mode added successfully', mode: newMode });
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment mode', error: error.message });
  }
};

const addBankTransaction = async (req, res) => {
  const { date, amount, type, mode, account } = req.body; // No need for netBalance from input
  const { licenseId } = req.user;

  if (!date || !amount || !type || !mode || !account) {
    return res.status(400).json({ message: 'All transaction fields are required' });
  }

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const TransactionModel = userDB.model('Transaction', Transaction.schema);
    const BankAccountModel = userDB.model('BankAccount', BankAccount.schema);

    // Convert the amount to a number
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Find the bank account
    const bankAccount = await BankAccountModel.findOne({ name: account });
    if (!bankAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    // Adjust the balance based on the transaction type (credit or debit)
    if (type === 'Credit') {
      bankAccount.balance += parsedAmount; // Add amount for credit transactions
    } else if (type === 'Debit') {
      if (bankAccount.balance < parsedAmount) {
        return res.status(400).json({ message: 'Insufficient funds for debit transaction' });
      }
      bankAccount.balance -= parsedAmount; // Subtract amount for debit transactions
    }

    // Save the updated bank account balance
    await bankAccount.save();

    // Create a new transaction and save it
    const newTransaction = new TransactionModel({
      date,
      amount: parsedAmount,
      type,
      mode,
      account,
      netBalance: bankAccount.balance, // Store the updated netBalance
    });
    await newTransaction.save();

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: newTransaction, // Return the transaction which includes netBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
};



// Delete a bank account
const deleteBankAccount = async (req, res) => {
  const { id } = req.params; // Get the account ID from the request params
  const { licenseId } = req.user; // Get the user's licenseId from the authenticated user

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const BankAccountModel = userDB.model('BankAccount', BankAccount.schema);

    // Find and delete the bank account by ID
    const deletedAccount = await BankAccountModel.findByIdAndDelete(id);

    if (!deletedAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    res.status(200).json({ message: 'Bank account deleted successfully', account: deletedAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bank account', error: error.message });
  }
};

// Delete a payment mode
const deletePaymentMode = async (req, res) => {
  const { id } = req.params; // Get the payment mode ID from the request params
  const { licenseId } = req.user; // Get the user's licenseId from the authenticated user

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const PaymentModeModel = userDB.model('PaymentMode', PaymentMode.schema);

    // Find and delete the payment mode by ID
    const deletedMode = await PaymentModeModel.findByIdAndDelete(id);

    if (!deletedMode) {
      return res.status(404).json({ message: 'Payment mode not found' });
    }

    res.status(200).json({ message: 'Payment mode deleted successfully', mode: deletedMode });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment mode', error: error.message });
  }
};

const getAllBankAccounts = async (req, res) => {
  const { licenseId } = req.user; // Get the user's licenseId from the authenticated user

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const BankAccountModel = userDB.model('BankAccount', BankAccount.schema);

    const accounts = await BankAccountModel.find(); // Fetch all bank accounts
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bank accounts', error: error.message });
  }
};

const getAllPaymentModes = async (req, res) => {
  const { licenseId } = req.user;

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const PaymentModeModel = userDB.model('PaymentMode', PaymentMode.schema);

    const modes = await PaymentModeModel.find(); // Fetch all payment modes
    res.status(200).json(modes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment modes', error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  const { licenseId } = req.user;

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    const TransactionModel = userDB.model('Transaction', Transaction.schema);

    const transactions = await TransactionModel.find(); // Fetch all transactions
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

const deleteDataTransaction = async (req, res) => {
  const { transactionId, account } = req.body;
  const { licenseId } = req.user;

  // Check for missing data
  if (!transactionId || !account) {
    return res.status(400).json({ message: 'Transaction ID and account are required' });
  }

  try {
    // Get the user-specific DB connection from cache
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    const userDB = connections[userDBURI];
    if (!userDB) {
      return res.status(500).json({ message: 'Failed to connect to user database' });
    }

    const TransactionModel = userDB.model('Transaction', Transaction.schema);
    const BankAccountModel = userDB.model('BankAccount', BankAccount.schema);

    // Find and delete the transaction
    const transaction = await TransactionModel.findByIdAndDelete(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Find the bank account
    const bankAccount = await BankAccountModel.findOne({ name: account });
    if (!bankAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    // Adjust the balance based on the transaction type
    if (transaction.type === 'Credit') {
      bankAccount.balance -= parseFloat(transaction.amount); // Subtract amount for credit
    } else if (transaction.type === 'Debit') {
      bankAccount.balance += parseFloat(transaction.amount); // Add amount for debit
    }

    // Save the updated balance
    await bankAccount.save();

    // Respond with success message
    res.status(200).json({ message: 'Transaction deleted and balance updated successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
};

// Razorpay credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_ID,  // Replace with your Razorpay key ID
  key_secret: process.env.KEY_SECRET,  // Replace with your Razorpay secret key
});

const razePayment = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and Currency are required' });
  }

  try {
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise (1 INR = 100 paise)
      currency: currency,
      receipt: `txn_${Math.floor(Math.random() * 1000000)}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      throw new Error('Failed to create Razorpay order');
    }

    res.json({
      transactionId: order.id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating payment order', details: err.message });
  }
};

module.exports = {
  generateLicenseId,
  googleCallback,
  registerUser,
  loginUser,
  sendEmail,
  sendFeedback,
  addProduct,
  getProduct,
  getAllData,
  fullName,
  TNewUsers,
  newTransaction,
  TAllUsers,
  deleteTransaction,
  deleteTuser,
  addBillData,
  getBillData,
  addBankAccount,
  addPaymentMode,
  addBankTransaction,
  deleteBankAccount,
  deletePaymentMode,
  getAllBankAccounts,
  getAllPaymentModes,
  getAllTransactions,
  deleteDataTransaction,
  razePayment,
};
