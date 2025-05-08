import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLicenseId("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }

    try {
      // Send the email to the backend to trigger sending the welcome email
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/send-email`,
        { email }
      );
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        {
          name,
          email,
          password,
        }
      );

      if (response.status === 201) {
        setMessage(
          "Signup successful! You will be redirected to login page soon!"
        );
        setMessageType("success");
        setLicenseId(response.data.licenseId);
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

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(licenseId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md bg-gradient-to-br from-[#042f49] to-[#0a4a6e] p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Create an Account
        </h1>
        <p className="mb-6 text-center text-white">
          Join us today and start your journey with our services.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <p className="font-bold">
              {messageType === "success" ? "Success" : "Error"}
            </p>
            <p>{message}</p>
          </div>
        )}

        {licenseId && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700">
            <p className="font-bold">Your License ID</p>
            <div className="flex items-center justify-between">
              <span>{licenseId}</span>
              <button
                onClick={handleCopy}
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-white mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-3 py-2 bg-white text-[#042f49] rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 bg-white text-[#042f49] rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 bg-white text-[#042f49] rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-white mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              className="w-full px-3 py-2 bg-white text-[#042f49] rounded"
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
        <div className="mt-6">
          <button
            className="w-full btn bg-white text-black border-[#e5e5e5]"
            onClick={handleGoogleSignup}
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
