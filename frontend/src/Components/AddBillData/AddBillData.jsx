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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, qr: reader.result });
      };
      reader.readAsDataURL(file);
    }
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

        {/* QR Image Upload */}
        <div>
          <label htmlFor="qr" className="block text-sm font-medium">
            Upload QR Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Preview QR (optional) */}
        {formData.qr && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">QR Preview:</p>
            <img
              src={formData.qr}
              alt="QR Preview"
              className="w-32 h-32 border rounded-md"
            />
          </div>
        )}
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
