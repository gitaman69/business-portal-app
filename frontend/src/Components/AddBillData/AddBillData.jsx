import React, { useState } from "react";
import axios from "axios";

const AddBillData = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    storeMail: "",
    storeContact: "",
    storeAddress: "",
  });

  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: "", type: "", visible: false });
    }, 3000); // Toast disappears after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/add-bill-data`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Bill data added successfully!", "success");

      // Optionally reset the form
      setFormData({
        storeName: "",
        storeMail: "",
        storeContact: "",
        storeAddress: "",
      });
    } catch (error) {
      console.error("Error adding bill data:", error);
      showToast("Failed to add bill data", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold mb-4">Add Bill Data</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium">
            Store Name
          </label>
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="storeMail" className="block text-sm font-medium">
            Store Email
          </label>
          <input
            type="email"
            name="storeMail"
            value={formData.storeMail}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="storeContact" className="block text-sm font-medium">
            Store Contact
          </label>
          <input
            type="text"
            name="storeContact"
            value={formData.storeContact}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="storeAddress" className="block text-sm font-medium">
            Store Address
          </label>
          <input
            type="text"
            name="storeAddress"
            value={formData.storeAddress}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Bill Data
        </button>
      </form>

      {/* Custom Toast Component */}
      {toast.visible && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-md text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AddBillData;
