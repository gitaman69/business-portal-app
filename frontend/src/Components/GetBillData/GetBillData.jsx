import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeeBillData = () => {
  const [billData, setBillData] = useState([]);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/get-bill-data`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        setBillData(response.data);
      } catch (error) {
        console.error('Error fetching bill data:', error);
        alert('Failed to fetch bill data');
      }
    };

    fetchBillData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Bill Data</h1>
      {billData.length === 0 ? (
        <p>No bill data available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Store Name</th>
              <th className="px-4 py-2 text-left">Store Email</th>
              <th className="px-4 py-2 text-left">Store Contact</th>
              <th className="px-4 py-2 text-left">Store Address</th>
            </tr>
          </thead>
          <tbody>
            {billData.map((bill, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{bill.storeName}</td>
                <td className="px-4 py-2">{bill.storeMail}</td>
                <td className="px-4 py-2">{bill.storeContact}</td>
                <td className="px-4 py-2">{bill.storeAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SeeBillData;
