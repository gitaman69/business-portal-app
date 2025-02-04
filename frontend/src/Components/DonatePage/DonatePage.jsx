import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";

const DonatePage = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [transactionId, setTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Step 1: Create Razorpay order
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/donate`, { amount, currency });
  
      // Step 2: Initialize Razorpay Checkout (this part is handled by Razorpay's SDK)
      const options = {
        key: process.env.KEY_ID,  // Your Razorpay Key ID
        amount: amount * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
        currency: currency,
        name: "BillGram",
        description: "Donation",
        order_id: response.data.transactionId, // Order ID created in backend
        handler: function (response) {
          // After successful payment, response contains the payment ID and signature
          const paymentId = response.razorpay_payment_id;
          setTransactionId(paymentId);
        },
        theme: {
          color: "#F37254",
        },
      };
      
  
      const rzp = new window.Razorpay(options);
      rzp.open(); // Open Razorpay payment window
  
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Support Us with a Donation</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <form onSubmit={handleDonate}>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-lg font-semibold mb-2">
              Donation Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="currency" className="block text-lg font-semibold mb-2">
              Select Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors"
          >
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {transactionId && (
          <div className="mt-6 text-center text-green-600">
            <p className="font-semibold">Donation Successful!</p>
            <p>Your transaction ID is: {transactionId}</p>
          </div>
        )}
      </div>

      <Link to="/" className="mt-8 text-purple-600 hover:underline text-lg flex items-center">
        <FaRegHeart className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default DonatePage;
