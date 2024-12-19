import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({onLogin}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    licenseId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
        licenseId: formData.licenseId,
      });

      const userResponse = await axios.get(`http://localhost:5000/api/auth/getName/${response.data.user.licenseId}`);


      const {token} = response.data;
      localStorage.setItem('authToken', token);

      if (response.status === 200) {
        const license = response.data.user.licenseId;
        onLogin({ licenseId: license, fullName: userResponse.data.fullName });
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md bg-gradient-to-br from-[#042f49] to-[#0a4a6e] p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Welcome Back
        </h1>
        <p className="mb-6 text-center text-white">
          Log in to access your account and manage your services.
        </p>
        {error && (
          <div className="mb-4 bg-red-500 text-white py-2 px-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-500 text-white py-2 px-4 rounded">
            {success}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
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
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-white text-[#042f49] px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="licenseId" className="block mb-1 text-white">
              License Number
            </label>
            <input
              id="licenseId"
              type="text"
              value={formData.licenseId}
              onChange={handleInputChange}
              className="w-full bg-white text-[#042f49] px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#d62320] hover:bg-[#b51e1b] text-white py-2 rounded"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-white">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#d62320] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
