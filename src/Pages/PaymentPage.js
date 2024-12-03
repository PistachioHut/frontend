import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const OrderSummary = ({ cartItems, total, shippingCost }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <div className="space-y-3 border-t border-gray-200 pt-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">${(total - shippingCost).toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">${shippingCost.toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-3">
        <span className="font-medium">Total</span>
        <span className="font-medium">${total.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const PaymentPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [formData, setFormData] = useState({
    email: isAuthenticated && user ? user.email : "",
    address: "",
    shipping: "Standard Shipping - FREE",
    cardNumber: "",
    holderName: "",
    expiration: "",
    cvv: "",
  });

  const [editing, setEditing] = useState({
    email: false,
    address: false,
    shipping: false,
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedCartItems = response.data;

        let updatedCart = [];
        let total = 0;

        for (let item of fetchedCartItems) {
          const productResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/${item.product_id}`);
          const product = productResponse.data;

          if (product.quantity_in_stock === 0) {
            updatedCart.push({
              ...item,
              maxAvailable: 0,
              highlight: true,
              notification: "Out of stock",
            });
          } else if (product.quantity_in_stock < item.quantity) {
            total += product.price * product.quantity_in_stock;
            updatedCart.push({
              ...item,
              quantity: product.quantity_in_stock,
              maxAvailable: product.quantity_in_stock,
              highlight: true,
              notification: `Only ${product.quantity_in_stock} available.`,
            });
          } else {
            total += product.price * item.quantity;
            updatedCart.push({
              ...item,
              maxAvailable: product.quantity_in_stock,
              highlight: false,
              notification: null,
            });
          }
        }

        setCartItems(updatedCart);
        setTotalCost(total);
      } catch (err) {
        console.error("Failed to fetch cart items or product details", err);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const shippingCost = formData.shipping === "Express Shipping - $9.99" ? 9.99 : 0;
    setShippingCost(shippingCost);
    setTotalCost(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost);
  }, [formData.shipping, cartItems]);

  const handleEdit = (field) => {
    setEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayNow = async () => {
    try {
      const token = localStorage.getItem('accessToken');
  
      // Step 1: Deduct Stock for Each Product
      for (let item of cartItems) {
        if (item.quantity > 0) {
            await axios.patch(
            `${process.env.REACT_APP_BACKEND_URL}/products/stock/decrease/${item.product_id}`,
            { quantity: item.quantity },
            {
              headers: {
              Authorization: `Bearer ${token}`,
              },
            }
            );
        }
      }
  
      // Step 2: Add Order to Backend
      const orderData = {
        email: formData.email,
        shipping_method: formData.shipping,
        shipping_address: formData.address,
        shipping_cost: shippingCost,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_link: item.image_link,
        })),
        total_price: totalCost,
      };
  
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/orders/add', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Step 3: Clear the Cart
      await axios.delete(process.env.REACT_APP_BACKEND_URL + '/cart/clear', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Step 4: Navigate to Thank You Page
      navigate('/thank-you', { state: { order: orderData } });
    } catch (err) {
      console.error('Failed to complete payment or process order', err);
      alert('An error occurred during the payment process.');
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/cart" className="text-gray-500">Cart</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Payment</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Contact Info */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600">Contact</p>
                <button
                  onClick={() => handleEdit('email')}
                  className="text-green-600 text-sm"
                >
                  Edit
                </button>
              </div>
              {editing.email ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-sm">{formData.email}</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600">Ship to</p>
                <button
                  onClick={() => handleEdit('address')}
                  className="text-green-600 text-sm"
                >
                  Edit
                </button>
              </div>
              {editing.address ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-sm">{formData.address}</p>
              )}
            </div>

            {/* Shipping Method */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600">Method</p>
                <button
                  onClick={() => handleEdit('shipping')}
                  className="text-green-600 text-sm"
                >
                  Edit
                </button>
              </div>
              {editing.shipping ? (
                <select
                  value={formData.shipping}
                  onChange={(e) => handleInputChange('shipping', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Standard Shipping - FREE">Standard Shipping - FREE</option>
                  <option value="Express Shipping - $9.99">Express Shipping - $9.99</option>
                </select>
              ) : (
                <p className="text-sm">{formData.shipping}</p>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Payment Details</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Holder Name"
                  value={formData.holderName}
                  onChange={(e) => handleInputChange('holderName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Expiration (MM/YY)"
                    value={formData.expiration}
                    onChange={(e) => handleInputChange('expiration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between mt-8">
              <Link to="/cart" className="text-green-600 hover:text-green-700">Back to shopping</Link>
              <button onClick={handlePayNow} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
                Pay now
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            {cartItems.map(item => (
              <div key={item.product_id} className={`p-4 rounded-md mb-4 ${item.highlight ? 'bg-red-100' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-4">
                  <img src={item.image_link} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-green-600">${item.price}</p>
                    {item.notification && <p className="text-sm text-red-600">{item.notification}</p>}
                  </div>
                </div>
                <p className="mt-2 text-right">Quantity: {item.quantity}</p>
              </div>
            ))}
            <OrderSummary cartItems={cartItems} total={totalCost} shippingCost={shippingCost} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
