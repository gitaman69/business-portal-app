const express = require('express');
const passport = require("passport");
const { loginUser, registerUser, sendEmail, addProduct, getProduct, getAllData, fullName, TNewUsers, newTransaction, TAllUsers, deleteTransaction, deleteTuser, addBillData, getBillData, sendFeedback, addBankAccount, addPaymentMode, addBankTransaction, deleteBankAccount, deletePaymentMode, getAllBankAccounts, getAllPaymentModes, getAllTransactions, deleteDataTransaction, razePayment, googleCallback} = require('../controllers/authController');
const authMiddleware = require('../Middleware/middleware');
const router = express.Router();

// Health check route
// This route is used to check if the server is running and healthy
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res, next) => googleCallback(req, res)
);

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', registerUser);

//send email
router.post('/send-email',sendEmail);

//send-feedback
router.post('/send-feedback',sendFeedback);

//send payment
router.post('/donate',razePayment);

//add product
router.post('/addProduct',authMiddleware, addProduct);

//get product
router.get('/product/:barcode',authMiddleware, getProduct);

//getting all products
router.get('/allProducts',authMiddleware,getAllData);

//get full Name
router.get('/getName/:licenseId',fullName);

//add bill data
router.post('/add-bill-data',authMiddleware,addBillData);

//get bill data
router.get('/get-bill-data',authMiddleware,getBillData);

//new TUser
router.post('/users',authMiddleware,TNewUsers);

//new transaction
router.post('/users/:id/transactions',authMiddleware,newTransaction);

//get all Tusers
router.get('/users',authMiddleware,TAllUsers);

//delete transaction
router.delete('/users/:userId/transactions/:index',authMiddleware,deleteTransaction);

//delete Tuser
router.delete('/users/:userId',authMiddleware,deleteTuser);

// Add a bank account
router.post('/addBankAccount', authMiddleware, addBankAccount);

// Add a payment mode
router.post('/addPaymentMode', authMiddleware, addPaymentMode);

// Add a transaction
router.post('/addTransaction', authMiddleware, addBankTransaction);

// Delete a bank account
router.delete('/deleteBankAccount/:id', authMiddleware, deleteBankAccount);

// Delete a payment mode
router.delete('/deletePaymentMode/:id', authMiddleware, deletePaymentMode);

// Get all bank accounts
router.get('/bankAccounts', authMiddleware, getAllBankAccounts);

// Get all payment modes
router.get('/paymentModes', authMiddleware, getAllPaymentModes);

// Get all transactions
router.get('/transactions', authMiddleware, getAllTransactions);

//delete data transaction
router.delete('/delete-data-transaction',authMiddleware,deleteDataTransaction);

module.exports = router;
