const express = require('express');
const { loginUser, registerUser, sendEmail, addProduct, getProduct, getAllData, fullName, TNewUsers, newTransaction, TAllUsers, deleteTransaction, deleteTuser } = require('../controllers/authController');
const authMiddleware = require('../Middleware/middleware');
const router = express.Router();

// Login route
router.post('/login',authMiddleware, loginUser);

// Signup route
router.post('/signup',authMiddleware, registerUser);

//send email
router.post('/send-email',sendEmail);

//add product
router.post('/addProduct',authMiddleware, addProduct);

//get product
router.get('/product/:barcode',authMiddleware, getProduct);

//getting all products
router.get('/allProducts',authMiddleware,getAllData);

//get full Name
router.get('/getName/:licenseId',authMiddleware,fullName);

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
