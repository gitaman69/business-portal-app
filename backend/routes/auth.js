const express = require('express');
const { loginUser, registerUser, sendEmail, addProduct, getProduct, getAllData, fullName, TNewUsers, newTransaction, TAllUsers, deleteTransaction, deleteTuser, addBillData, getBillData, sendFeedback } = require('../controllers/authController');
const authMiddleware = require('../Middleware/middleware');
const router = express.Router();

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', registerUser);

//send email
router.post('/send-email',sendEmail);

//send-feedback
router.post('/send-feedback',sendFeedback);

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

module.exports = router;
