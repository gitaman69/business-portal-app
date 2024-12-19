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

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
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
        <Route element={<HeaderLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><BillingPage/></ProtectedRoute>} />
          <Route path="/addProduct" element={<ProtectedRoute><ProductManagement/></ProtectedRoute> } />
          <Route path="/inventory" element={<ProtectedRoute><InventoryView/></ProtectedRoute>} />
          <Route path="/expenseTracker" element={<ProtectedRoute><ExpenseTracker/></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
