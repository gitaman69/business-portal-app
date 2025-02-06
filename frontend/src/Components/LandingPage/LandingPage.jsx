import React, { useState } from "react";
import { Link } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";
import { FaHeart } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    text: "BillGram has revolutionized our billing process!",
    author: "Jane D., Small Business Owner",
  },
  {
    id: 2,
    text: "I've saved hours each week thanks to this app.",
    author: "John S., Freelancer",
  },
  {
    id: 3,
    text: "The financial insights are invaluable for our growth.",
    author: "Emily R., Startup Founder",
  },
  {
    id: 4,
    text: "Customer support is top-notch. Highly recommended!",
    author: "Michael T., CFO",
  },
  {
    id: 5,
    text: "Easy to use and powerful. The perfect combination.",
    author: "Sarah L., Accountant",
  },
];

const LandingPage = () => {
  const [emailInput, setEmailInput] = useState("");

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">BillGram</h1>
          <div className="space-x-3">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </button>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simplify Your Business Billing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Effortless invoicing and payment tracking for growing businesses
          </p>
          <Link to="/signup">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors mr-4">
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-50 transition-colors">
            <a
              href="https://youtube.com/shorts/quftRzeI7HA?si=88GQKuyAS3gU9x-G"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Demo
            </a>
          </button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Easy Invoicing
            </h3>
            <p className="text-gray-600">
              Create and send professional invoices in minutes. Get paid faster
              with our intuitive tools.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              Financial Insights
            </h3>
            <p className="text-gray-600">
              Gain valuable insights into your cash flow and business
              performance with our powerful analytics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Automated Reminders
            </h3>
            <p className="text-gray-600">
              Never chase a payment again. Set up automatic reminders for
              overdue invoices.
            </p>
          </div>
        </section>

        <section className="mb-10 overflow-hidden bg-blue-50 py-10 rounded-lg">
          <div className="animate-marquee whitespace-nowrap space-x-4">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="inline-block w-96 bg-white p-6 rounded-lg shadow-md whitespace-normal break-words"
              >
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="text-blue-600 font-semibold">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg p-6 md:p-10 mb-0">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
            Ready to streamline your billing process?
          </h3>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            Join thousands of businesses already using BillGram
          </p>
          <div className="flex flex-col md:flex-row max-w-md md:max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={emailInput}
              onChange={handleEmailChange}
              className="flex-grow px-4 py-2 rounded-t-md md:rounded-l-md md:rounded-t-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link to="/signup">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-b-md md:rounded-r-md md:rounded-b-none hover:bg-blue-700 transition-colors w-full md:w-auto">
                Get Started
              </button>
            </Link>
          </div>
          <Link to="/donate">
            <div className="fixed bottom-20 right-5 w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <FaHeart />
            </div>
          </Link>
          <Link to="/feedback">
            <div className="fixed bottom-5 right-5 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <VscFeedback />
            </div>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 py-4 mb-0">
        <div className="container mx-auto px-4 text-center text-gray-600 mb-0">
          © 2023 BillGram. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
