import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './Pages/HomePage';
import ProductsPage from './Pages/ProductsPage';
import ProductDetailsPage from './Pages/ProductDetailsPage';
import CartPage from './Pages/CartPage';
import PaymentPage from './Pages/PaymentPage';
import ThankYouPage from './Pages/ThankYouPage';
import { LoginPage, SignupPage } from './Pages/AuthPages';
import About from './Pages/About';
import Contact from './Pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './Pages/AdminDashboard';
import AuthProvider from './contexts/AuthContext';
import AddProductPage from './Pages/AddProduct';
import DashboardPage from './Pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/addProduct" element={<AddProductPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute roles={['Product Manager', 'Sales Manager']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;