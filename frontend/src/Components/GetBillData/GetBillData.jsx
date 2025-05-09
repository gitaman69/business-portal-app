import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeeBillData = () => {
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/get-bill-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBillData(response.data);
      } catch (error) {
        console.error('Error fetching bill data:', error);
        alert('Failed to fetch bill data');
      } finally {
        setLoading(false);
      }
    };

    fetchBillData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Bill Data</h1>

      {loading ? (
        <p className="text-gray-600 text-lg flex items-center justify-center">
          Loading <span className="loading loading-infinity loading-xl ml-2"></span>
        </p>
      ) : billData.length === 0 ? (
        <p className="text-center">No bill data available.</p>
      ) : (
        <div className="grid gap-6">
          {billData.map((bill, index) => (
            <div key={index} className="border rounded-lg p-4 shadow bg-white">
              <div className="mb-2">
                <strong>Store Name:</strong> <span>{bill.storeName}</span>
              </div>
              <div className="mb-2">
                <strong>Store Email:</strong> <span>{bill.storeMail}</span>
              </div>
              <div className="mb-2">
                <strong>Store Contact:</strong> <span>{bill.storeContact}</span>
              </div>
              <div className="mb-2">
                <strong>Store Address:</strong> <span>{bill.storeAddress}</span>
              </div>
              <div>
                <strong>QR Code:</strong>
                <div className="mt-2">
                  {bill.qr ? (
                    <img
                      src={bill.qr}
                      alt="QR Code"
                      className="w-24 h-24 object-contain border rounded"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No QR</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeBillData;
