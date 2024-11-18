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

function App() {
  return (
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
        
        {/* Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute roles={['PRODUCT_MANAGER', 'SALES_MANAGER']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;