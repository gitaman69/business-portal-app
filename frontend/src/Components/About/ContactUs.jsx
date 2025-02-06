import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-gray-900 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-4xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h1 className="text-5xl font-bold text-center text-blue-600">Contact Us</h1>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Home</Link>
        </div>
        <p className="text-lg text-gray-700 text-center relative z-10 mb-6">
          We'd love to hear from you! Reach out to us for any queries, support, or feedback.
        </p>
        
        <div className="relative z-10 space-y-6 w-full max-w-2xl">
          <div className="bg-gray-100 p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Email</h3>
            <p className="text-gray-600">cityrentalsbuisness@gmail.com</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Phone</h3>
            <p className="text-gray-600">+916377838527</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Address</h3>
            <p className="text-gray-600">MNIT JAIPUR</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
