import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const OrderPanel = ({ order, setOrders }) => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [productStatuses, setProductStatuses] = useState([]);

  useEffect(() => {
    const fetchProductStatuses = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const updatedStatuses = await Promise.all(
          order.items.map(async (item) => {
            const refundResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/refund-status`, {
              params: { order_id: order.order_number, product_id: item.product_id },
              headers: { Authorization: `Bearer ${token}` },
            });

            return {
              product_id: item.product_id,
              refund_status: refundResponse.data.refund_status || 'N/A',
              delivery_status: item.delivery_status || 'Pending',
            };
          })
        );
        setProductStatuses(updatedStatuses);
      } catch (error) {
        console.error('Failed to fetch product statuses:', error);
      }
    };

    fetchProductStatuses();
  }, [order]);

  const handleRefund = async (product) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/refund`,
        {
          order_number: order.order_number,
          product,
          product_id: product.product_id,
          email: user?.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Refund request submitted successfully.');

      // Re-fetch orders to update the state and reflect the refund status
      const ordersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(ordersResponse.data.order_history);
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert('Failed to submit refund request.');
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/orders/remove/${order.order_number}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Order canceled successfully.');

      // Re-fetch orders to update the state and remove the canceled order
      const ordersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(ordersResponse.data.order_history);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      <div className="grid grid-cols-8 gap-4 items-center text-sm">
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order #</p>
          <p className="font-medium">{order.order_number}</p>
        </div>
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Date</p>
          <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Amount</p>
          <p className="font-medium text-green-600">${order.total_price.toFixed(2)}</p>
        </div>
        <div className="px-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Details {isOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
        </div>
        <div className="px-2">
          <button
            onClick={handleCancelOrder}
            className="w-full px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Cancel Order
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-medium mb-2 text-xs uppercase tracking-wider text-gray-500">Order Details</h4>
          <div className="bg-gray-50 rounded-md p-3 text-xs">
            <table className="table-auto w-full border-collapse border border-gray-200 text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-gray-200">Product</th>
                  <th className="px-4 py-2 border border-gray-200">Price</th>
                  <th className="px-4 py-2 border border-gray-200">Quantity</th>
                  <th className="px-4 py-2 border border-gray-200">Delivery Status</th>
                  <th className="px-4 py-2 border border-gray-200">Refund Status</th>
                  <th className="px-4 py-2 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const productStatus = productStatuses.find((p) => p.product_id === item.product_id);

                  const refundButtonState = (() => {
                    if (item.refund_processing === 'Processing') {
                      return { disabled: true, message: 'Refund Processing', className: 'bg-gray-200 text-gray-500 cursor-not-allowed' };
                    }
                    if (item.refund_processing === 'Denied' || item.refund_processing === 'Rejected') {
                      return { disabled: true, message: 'Refund Denied', className: 'bg-gray-200 text-gray-500 cursor-not-allowed' };
                    }
                    if (item.refund_processing === 'Complete') {
                      return { disabled: true, message: 'Refund Complete', className: 'bg-gray-200 text-gray-500 cursor-not-allowed' };
                    }
                    if (item.status === 'Complete') {
                      return { disabled: true, message: 'Delivered', className: 'bg-gray-200 text-gray-500 cursor-not-allowed' };
                    }
                    return { disabled: false, message: 'Request Refund', className: 'bg-red-500 text-white hover:bg-red-600' };
                  })();

                  return (
                    <tr key={item.product_id} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">${item.price}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.status || 'Pending'}</td>
                      <td className="px-4 py-2">{item.refund_processing || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRefund(item)}
                          disabled={refundButtonState.disabled}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${refundButtonState.className}`}
                        >
                          {refundButtonState.message}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


const WishlistItem = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      <div className="grid grid-cols-8 gap-4 items-center">
        <div className="col-span-3 px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Product Name</p>
          <p className="font-medium text-gray-900">{item.name}</p>
        </div>
        <div className="col-span-1 px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Price</p>
          <p className="font-medium text-green-600">${item.price}</p>
        </div>
        <div className="col-span-2 px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Added On</p>
          <p className="font-medium">{new Date(item.added_on).toLocaleDateString()}</p>
        </div>
        <div className="col-span-2 px-2">
          <Link 
            to={`/product/${item.product_id}`}
            className="w-full px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            Go to Product
          </Link>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const ordersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersResponse.data.order_history);

        const wishlistResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlistResponse.data.wishlist);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-gray-600">Here's an overview of your orders and wishlist.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Your Orders</h2>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order, index) => <OrderPanel key={index} order={order} setOrders={setOrders} />)
              ) : (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Your Wishlist</h2>
            <div className="space-y-4">
              {wishlist.length > 0 ? (
                wishlist.map((item) => <WishlistItem key={item.id} item={item} />)
              ) : (
                <p className="text-gray-500 text-center py-8">Your wishlist is empty</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
