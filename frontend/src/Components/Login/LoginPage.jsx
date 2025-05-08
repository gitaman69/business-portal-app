import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({ onLogin }) {
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
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
          licenseId: formData.licenseId,
        }
      );

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      const userResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/getName/${response.data.user.licenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const licenseId = params.get("licenseId");

    if (token && licenseId) {
      localStorage.setItem("authToken", token);

      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/getName/${licenseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          onLogin({ licenseId, fullName: res.data.fullName });
          navigate("/dashboard");
        })
        .catch(() => setError("Google login failed. Try again."));
    }
  }, [navigate, onLogin]);

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
        <div className="mt-6">
          <button
            className="w-full btn bg-white text-black border-[#e5e5e5]"
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`)
            }
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
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
