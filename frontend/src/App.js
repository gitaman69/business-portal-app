import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Header from './Components/Header/header';
import SignUpPage from './Components/SignUp/SignUpPage';
import LoginPage from './Components/Login/LoginPage';
import LandingPage from './Components/LandingPage/LandingPage';
import BillingPage from './Components/BillingPage/billingPage';
import ProductManagement from './Components/AddProduct/addProduct';
import InventoryView from './Components/Inventory/inventory-view';
import ExpenseTracker from './Components/ExpenseTracker/ExpenseTracker';
import AddBillData from './Components/AddBillData/AddBillData';
import SeeBillData from './Components/GetBillData/GetBillData';
import FeedBackForm from './Components/FeedBackForm/FeedbackForm';
import DataEntry from './Components/DataEntry/DataEntry';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    // Call backend logout API (if implemented)
    if (token) {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in header
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("Logout success:", data))
        .catch((error) => console.error("Logout error:", error));
    }
    setUser(null);
    await localStorage.removeItem("authToken");
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };
  

  const HeaderLayout = () => (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Outlet />
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/feedback" element={<FeedBackForm/>} />
        <Route element={<HeaderLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><BillingPage/></ProtectedRoute>} />
          <Route path="/addProduct" element={<ProtectedRoute><ProductManagement/></ProtectedRoute> } />
          <Route path="/inventory" element={<ProtectedRoute><InventoryView/></ProtectedRoute>} />
          <Route path="/expenseTracker" element={<ProtectedRoute><ExpenseTracker/></ProtectedRoute>} />
          <Route path="/dataEntry" element={<ProtectedRoute><DataEntry/></ProtectedRoute>} />
          <Route path="/add-bill-data" element={<ProtectedRoute><AddBillData/></ProtectedRoute>} />
          <Route path="/see-bill-data" element={<ProtectedRoute><SeeBillData/></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
