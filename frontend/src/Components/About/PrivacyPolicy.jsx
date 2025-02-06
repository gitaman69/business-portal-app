import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-gray-900 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-4xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
        
        {/* Home Button positioned at the top right */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h1 className="text-5xl font-bold text-center mb-6 relative z-10 text-blue-600">Privacy Policy</h1>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Home
          </Link>
        </div>
        
        <p className="text-lg text-gray-700 relative z-10 mb-6">
          At BillGram, we value your privacy and are committed to protecting your personal data. This policy outlines the information we collect, how we use it, and your rights regarding your data.
        </p>
        
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 relative z-10">Data Collection</h2>
        <p className="text-gray-700 mb-4 relative z-10">
          We collect personal information such as name, email, and transaction details to provide seamless billing services. Your data is securely stored and never shared with third parties without your consent.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mb-4 relative z-10">Razorpay Transactions</h2>
        <p className="text-gray-700 mb-4 relative z-10">
          BillGram integrates with Razorpay for secure transactions. All payments are processed through encrypted channels, ensuring the safety of your financial data. We do not store sensitive payment details.
        </p>
        
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 relative z-10">Your Rights</h2>
        <p className="text-gray-700 mb-6 relative z-10">
          You have the right to access, update, or delete your data. For any privacy concerns, please contact us at cityrentalsbuisness@gmail.com.
        </p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
