import React, { useState, useEffect } from "react";
import { LuRefreshCw } from "react-icons/lu";
import Toast from "./Toast.jsx";
import axios from "axios";

// Add an Axios interceptor to include the Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const DataEntryPage = () => {
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    type: "Credit",
    mode: "",
    account: "",
  });
  const [newPaymentMode, setNewPaymentMode] = useState("");
  const [newBankAccount, setNewBankAccount] = useState({
    name: "",
    balance: "",
  });

  // Function to fetch the data
  const fetchData = async () => {
    try {
      const [accountsRes, modesRes, transactionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/bankAccounts`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/paymentModes`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/transactions`),
      ]);
      setBankAccounts(accountsRes.data);
      setPaymentModes(modesRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Add the transaction via API
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/addTransaction`,
        newTransaction
      );
  
      // Destructure transaction from the API response
      const { transaction } = response.data;
  
      // Update the transactions list
      setTransactions((prev) => [...prev, transaction]);
  
      // Update the bank balance in the state
      setBankAccounts((prev) =>
        prev.map((account) => {
          if (account.name === transaction.account) {
            return { ...account, balance: transaction.netBalance }; // Update balance from response
          }
          return account;
        })
      );
  
      // Reset the form fields
      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        type: "Credit",
        mode: "",
        account: "",
      });
  
      // Display a success toast message
      setToastMessage("Transaction added successfully!");
      setToastType("success");
  
      // Optionally refresh the data
      fetchData();
    } catch (error) {
      console.error("Error adding transaction:", error);
  
      // Display an error toast message
      setToastMessage("Failed to add transaction.");
      setToastType("error");
    }
  };
  

  const addPaymentMode = async () => {
    if (newPaymentMode) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/addPaymentMode`,
          { name: newPaymentMode }
        );
        setPaymentModes((prev) => [...prev, response.data]);
        setNewPaymentMode("");
        fetchData();
      } catch (error) {
        console.error("Error adding payment mode:", error);
      }
    }
  };

  const addBankAccount = async () => {
    if (newBankAccount.name && newBankAccount.balance) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/addBankAccount`,
          newBankAccount
        );
        setBankAccounts((prev) => [...prev, response.data]);
        setNewBankAccount({ name: "", balance: "" });
        fetchData();
      } catch (error) {
        console.error("Error adding bank account:", error);
      }
    }
  };

  const deletePaymentMode = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/deletePaymentMode/${id}`
      );
      setPaymentModes((prev) => prev.filter((mode) => mode._id !== id));
      fetchData();
    } catch (error) {
      console.error(
        "Error deleting payment mode:",
        error.response?.data || error.message
      );
    }
  };

  const deleteBankAccount = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/deleteBankAccount/${id}`
      );
      setBankAccounts((prev) => prev.filter((account) => account._id !== id));
      fetchData();
    } catch (error) {
      console.error(
        "Error deleting bank account:",
        error.response?.data || error.message
      );
    }
  };

  const deleteTransaction = async (transactionId, account) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/delete-data-transaction`,
        {
          data: { transactionId, account },
        }
      );

      // Update the transactions list by removing the deleted transaction
      setTransactions((prev) =>
        prev.filter((transaction) => transaction._id !== transactionId)
      );

      // Update bank account balance after transaction deletion
      setBankAccounts((prev) =>
        prev.map((account) => {
          if (account.name === account) {
            const transaction = transactions.find(
              (t) => t._id === transactionId
            );
            if (transaction) {
              const amount = parseFloat(transaction.amount); // Ensure it's a number
              if (transaction.type === "Credit") {
                return {
                  ...account,
                  balance: account.balance - amount, // Subtract as a number
                };
              } else if (transaction.type === "Debit") {
                return {
                  ...account,
                  balance: account.balance + amount, // Add as a number
                };
              }
            }
          }
          return account;
        })
      );

      // Show success toast message
      setToastMessage(response.data.message);
      setToastType("success");
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      // Show error toast message
      setToastMessage("Error deleting transaction.");
      setToastType("error");
    }
  };

  const downloadEStatement = () => {
    const csvContent = [
      ["Date", "Amount", "Type", "Payment Mode", "Net Balance", "Bank Account"],
      ...transactions.map((t) => [t.date, t.amount, t.type, t.mode, t.netBalance, t.account]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "e-statement.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Billing Data Entry</h1>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={newTransaction.date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="border p-2 rounded"
            required
          />
          <select
            name="type"
            value={newTransaction.type}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
          <select
            name="mode"
            value={newTransaction.mode}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Payment Mode</option>
            {paymentModes.map((mode) => (
              <option key={mode.id} value={mode.name}>
                {mode.name}
              </option>
            ))}
          </select>
          <select
            name="account"
            value={newTransaction.account}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Bank Account</option>
            {bankAccounts.map((account) => (
              <option key={account.id} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </div>
      </form>

      {/* Add Payment Mode */}
      <div className="mb-4">
        <input
          type="text"
          value={newPaymentMode}
          onChange={(e) => setNewPaymentMode(e.target.value)}
          placeholder="New Payment Mode"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addPaymentMode}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Payment Mode
        </button>
      </div>

      {/* Add Bank Account */}
      <div className="mb-8">
        <input
          type="text"
          value={newBankAccount.name}
          onChange={(e) =>
            setNewBankAccount((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="New Bank Account Name"
          className="border p-2 rounded mr-2"
        />
        <input
          type="number"
          value={newBankAccount.balance}
          onChange={(e) =>
            setNewBankAccount((prev) => ({ ...prev, balance: e.target.value }))
          }
          placeholder="Initial Balance"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addBankAccount}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Bank Account
        </button>
      </div>

      {/* Payment Modes List */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-2">Payment Modes</h2>
          <button
            onClick={fetchData}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 ml-4"
          >
            <LuRefreshCw />
          </button>
        </div>
        <ul className="space-y-2">
          {paymentModes.map((mode) => (
            <li
              key={mode._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{mode.name}</span>
              <button
                onClick={() => deletePaymentMode(mode._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bank Accounts List */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-2">Bank Accounts</h2>
          <button
            onClick={fetchData}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 ml-4"
          >
            <LuRefreshCw />
          </button>
        </div>
        <ul className="space-y-2">
          {bankAccounts.map((account) => (
            <li
              key={account._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>
                {account.name} - Balance: ₹
                {account.balance
                  ? parseFloat(account.balance).toFixed(2)
                  : "0.00"}
              </span>
              <button
                onClick={() => deleteBankAccount(account._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* E-Statement Table */}
      <h2 className="text-xl font-bold mb-2">E-Statement</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Payment Mode</th>
              <th className="border p-2">Bank Account</th>
              <th className="border p-2">Net Balance</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              return (
                <tr key={transaction._id}>
                  <td className="border p-2">{transaction.date}</td>
                  <td className="border p-2">
                  ₹{parseFloat(transaction.amount).toFixed(2)}
                  </td>
                  <td className="border p-2">{transaction.type}</td>
                  <td className="border p-2">{transaction.mode}</td>
                  <td className="border p-2">{transaction.account}</td>
                  <td className="border p-2">₹{parseFloat(transaction.netBalance).toFixed(2)}</td>
                  <td className="border p-2">
                    <button
                      className="text-red-500"
                      onClick={() =>
                        deleteTransaction(transaction._id, transaction.account)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}

      {/* Download E-Statement Button */}
      <button
        onClick={downloadEStatement}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Download E-Statement
      </button>
    </div>
  );
};

export default DataEntryPage;