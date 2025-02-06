import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar, FaChartLine, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-gray-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>
        <h1 className="text-5xl font-bold text-center mb-6 relative z-10 text-blue-600">
          About BillGram
        </h1>
        <p className="text-lg text-gray-700 text-center relative z-10 mb-6">
          BillGram is an intuitive and efficient billing solution designed to
          simplify transactions for businesses of all sizes. With a seamless UI,
          real-time invoicing, and detailed reports, we empower businesses to
          manage their finances effortlessly.
        </p>

        <div className="flex flex-col md:flex-row justify-around items-center gap-6 relative z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center bg-gray-100 p-6 rounded-xl shadow-lg w-64"
          >
            <FaFileInvoiceDollar className="text-5xl text-blue-500 mb-3" />
            <h3 className="text-xl font-semibold">Easy Invoicing</h3>
            <p className="text-gray-600 text-center">
              Generate invoices in real-time with ease.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center bg-gray-100 p-6 rounded-xl shadow-lg w-64"
          >
            <FaChartLine className="text-5xl text-green-500 mb-3" />
            <h3 className="text-xl font-semibold">Balance Sheets</h3>
            <p className="text-gray-600 text-center">
              Generate financial reports in seconds.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center bg-gray-100 p-6 rounded-xl shadow-lg w-64"
          >
            <FaUsers className="text-5xl text-purple-500 mb-3" />
            <h3 className="text-xl font-semibold">Manage Transactions</h3>
            <p className="text-gray-600 text-center">
              Manage clients efficiently and track transactions.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <footer className="mt-12 text-gray-600 text-sm relative z-10 text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} BillGram. All rights reserved.
        </p>
        <div className="flex gap-6 justify-center">
          <Link to="/privacy-policy">
            <button className="hover:text-blue-600 transition">
              Privacy Policy
            </button>
          </Link>
          <Link to="/contact-us">
            <button
              className="hover:text-blue-600 transition"
            >
              Contact Us
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default About;
