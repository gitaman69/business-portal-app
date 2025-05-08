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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md text-sm sm:text-base">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left whitespace-nowrap">Store Name</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Store Email</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Store Contact</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Store Address</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">QR Code</th>
              </tr>
            </thead>
            <tbody>
              {billData.map((bill, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 break-words">{bill.storeName}</td>
                  <td className="px-4 py-2 break-words">{bill.storeMail}</td>
                  <td className="px-4 py-2 break-words">{bill.storeContact}</td>
                  <td className="px-4 py-2 break-words">{bill.storeAddress}</td>
                  <td className="px-4 py-2">
                    {bill.qr ? (
                      <img
                        src={bill.qr}
                        alt="QR Code"
                        className="w-16 h-16 object-contain border rounded"
                      />
                    ) : (
                      <span className="text-gray-500 italic">No QR</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeeBillData;
