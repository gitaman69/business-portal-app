import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
  const [message, setMessage] = useState(""); // State for success/error messages
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear the previous message
    setMessageType("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target["confirm-password"].value,
    };

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }

    try {
      // Send the email to the backend to trigger sending the welcome email
      await axios.post("http://localhost:5000/api/auth/send-email", {
        email: e.target.email.value,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setMessage(`Signup successful! Save it for Login Purpose. Your license ID: ${response.data.licenseId}. You will be redirected to login page soon save it asap!`);
        setMessageType("success");
        setTimeout(() => navigate("/login"), 20000);
        e.target.reset(); // Clear the form
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md bg-gradient-to-br from-[#042f49] to-[#0a4a6e] p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Create an Account</h1>
        <p className="mb-6 text-center text-white">Join us today and start your journey with our services.</p>
        {message && (
          <p
            className={`mb-4 text-center font-semibold ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1 text-white">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full bg-white text-[#042f49] px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-white">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full bg-white text-[#042f49] px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-white">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full bg-white text-[#042f49] px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block mb-1 text-white">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              className="w-full bg-white text-[#042f49] px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#d62320] hover:bg-[#031d2d] text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-[#d62320] hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
