import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Header from './Components/Header/header.jsx';
import SignUpPage from './Components/SignUp/SignUpPage.jsx';
import LoginPage from './Components/Login/LoginPage.jsx';
import LandingPage from './Components/LandingPage/LandingPage.jsx';
import BillingPage from './Components/BillingPage/billingPage.jsx';
import ProductManagement from './Components/AddProduct/addProduct.jsx';
import InventoryView from './Components/Inventory/inventory-view.jsx';
import ExpenseTracker from './Components/ExpenseTracker/ExpenseTracker.jsx';
import AddBillData from './Components/AddBillData/AddBillData.jsx';
import SeeBillData from './Components/GetBillData/GetBillData.jsx';
import FeedBackForm from './Components/FeedBackForm/FeedbackForm.jsx';
import DataEntry from './Components/DataEntry/DataEntry.jsx';
import DonatePage from './Components/DonatePage/DonatePage.jsx';
import About from './Components/About/About.jsx';
import PrivacyPolicy from './Components/About/PrivacyPolicy.jsx';
import ContactUs from './Components/About/ContactUs.jsx';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);
  
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
        <Route path="/about" element={<About/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/contact-us" element={<ContactUs/>} />
        <Route path="/feedback" element={<FeedBackForm/>} />
        <Route path="/donate" element={<DonatePage />} />
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
