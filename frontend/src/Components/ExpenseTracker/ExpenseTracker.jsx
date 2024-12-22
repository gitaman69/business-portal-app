import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseTracker = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", mobile: "" });
  const [transactions, setTransactions] = useState({});

  // Fetch users and their transactions from the database
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("https://business-portal-app.onrender.com/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedUsers = response.data;
      if (fetchedUsers && Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
        const initialTransactions = {};
        fetchedUsers.forEach((user) => {
          initialTransactions[user._id] = { type: "", amount: "" };
        });
        setTransactions(initialTransactions);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        "https://business-portal-app.onrender.com/api/auth/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) => [...prevUsers, data]);
      setNewUser({ name: "", mobile: "" });
      setTransactions((prevTransactions) => ({
        ...prevTransactions,
        [data._id]: { type: "", amount: "" },
      }));
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Add transaction for a user
  const handleAddTransaction = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      const transaction = transactions[userId];
      const { data } = await axios.post(
        `https://business-portal-app.onrender.com/api/auth/users/${userId}/transactions`,
        transaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? data : user))
      );
      setTransactions((prevTransactions) => ({
        ...prevTransactions,
        [userId]: { type: "", amount: "" },
      }));
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  // Delete transaction for a user
  const handleDeleteTransaction = async (userId, index) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://business-portal-app.onrender.com/api/auth/users/${userId}/transactions/${index}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id === userId) {
            user.transactions.splice(index, 1);
          }
          return user;
        })
      );
    } catch (err) {
      console.error("Error deleting transaction:", err);
      fetchUsers(); // Reload data if the delete fails
    }
  };

  // Delete user and their transactions
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://business-portal-app.onrender.com/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      fetchUsers(); // Reload data if the delete fails
    }
  };

  // Calculate net amount for a user
  const calculateNetAmount = (user) => {
    let netAmount = 0;
    user.transactions.forEach((tx) => {
      netAmount += tx.type === "lent" ? -tx.amount : tx.amount;
    });
    return netAmount;
  };

  // Send net balance to WhatsApp
  const sendWhatsAppMessage = (user) => {
    const netAmount = calculateNetAmount(user);
    const upiId = "amanbhakar@ibl"; // Replace with the actual UPI ID

    const message = `Hello ${
      user.name
    }, your net balance is Rs. ${netAmount}.\nTransactions:\n${user.transactions
      .map(
        (tx, index) => `${index + 1}. ${tx.type.toUpperCase()} Rs. ${tx.amount}`
      )
      .join("\n")}\n\nYou can make your payment to the following UPI ID: ${upiId}`;

    const phoneNumber = user.mobile;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Money Tracker</h1>

      {/* Add User Form */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Mobile"
          value={newUser.mobile}
          onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
          className="p-2 border rounded w-1/3"
        />
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add User
        </button>
      </div>

      {/* User List */}
      {users &&
        Array.isArray(users) &&
        users.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.mobile}</p>

            {/* Delete User Button */}
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="text-white-500 hover:underline bg-red-500 rounded-md px-3 mt-4"
            >
              Delete User
            </button>

            {/* Transactions */}
            <div className="mt-4">
              {user.transactions.map((tx, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 rounded ${
                    tx.type === "lent" ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <span>
                    {tx.type === "lent" ? "💰 Lent" : "💸 Received"}: ₹
                    {tx.amount}
                  </span>
                  <button
                    onClick={() => handleDeleteTransaction(user._id, index)}
                    className="text-white-500 hover:underline bg-red-500 rounded-md px-3"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Net Amount */}
            <div className="mt-4 text-right font-bold">
              Net Amount: ₹{calculateNetAmount(user)}{" "}
              {calculateNetAmount(user) < 0 ? "(Negative)" : "(Positive)"}
            </div>

            {/* Add Transaction */}
            <div className="flex gap-2 mt-4">
              <select
                value={transactions[user._id]?.type || ""}
                onChange={(e) =>
                  setTransactions({
                    ...transactions,
                    [user._id]: {
                      ...transactions[user._id],
                      type: e.target.value,
                    },
                  })
                }
                className="p-2 border rounded"
              >
                <option value="">Type</option>
                <option value="lent">Lent</option>
                <option value="received">Received</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={transactions[user._id]?.amount || ""}
                onChange={(e) =>
                  setTransactions({
                    ...transactions,
                    [user._id]: {
                      ...transactions[user._id],
                      amount: e.target.value,
                    },
                  })
                }
                className="p-2 border rounded"
              />
              <button
                onClick={() => handleAddTransaction(user._id)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Transaction
              </button>
            </div>

            {/* Send WhatsApp Message */}
            <button
              onClick={() => sendWhatsAppMessage(user)}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
            >
              Send to WhatsApp
            </button>
          </div>
        ))}
    </div>
  );
};

export default ExpenseTracker;
