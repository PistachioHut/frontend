import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const OrderPanel = ({ order }) => {
  const { user, logout } = useContext(AuthContext); // Use AuthContext
  const [isOpen, setIsOpen] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);
  const daysSinceOrder = Math.floor((new Date() - new Date(order.created_at)) / (1000 * 60 * 60 * 24));
  const canRefund = daysSinceOrder <= 30;
  
  const calculateItemTotal = (price, quantity) => (price * quantity).toFixed(2);

  useEffect(() => {
    const checkRefundStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/refund-status`, {
          params: { order_id: order.order_number },
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setRefundStatus(response.data.status);
      } catch (error) {
        console.error("Failed to fetch refund status:", error);
      }
    };
  
    checkRefundStatus();
  }, [order.order_number]);

  const handleRefund = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/refund`,
        { order_number: order.order_number, email: user?.email, created_at: order.created_at, order: order },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRefundStatus("Processing");
      alert("Refund request submitted successfully.");
    } catch (error) {
      console.error("Failed to process refund:", error);
      alert("Failed to submit refund request.");
    }
  };

  const getRefundButtonState = () => {
    if (refundStatus === "Processing") {
      return { disabled: true, message: "Processing Refund", className: "bg-gray-200 text-gray-500 cursor-not-allowed" };
    }

    if (refundStatus === "Denied") {
      return { disabled: true, message: "Refund Denied", className: "bg-gray-200 text-gray-500 cursor-not-allowed" };
    }

    if (!canRefund) {
      return { disabled: true, message: "Refund Expired", className: "bg-gray-200 text-gray-500 cursor-not-allowed" };
    }

    return { disabled: false, message: "Refund", className: "bg-red-500 text-white hover:bg-red-600" };
  };

  const refundButtonState = getRefundButtonState();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
      <div className="grid grid-cols-7 gap-4 items-center">
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order #</p>
          <p className="font-medium">{order.order_number}</p>
        </div>
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Date</p>
          <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Days Since</p>
          <p className="font-medium">{daysSinceOrder} days</p>
        </div>
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Amount</p>
          <p className="font-medium text-green-600">${order.total_price.toFixed(2)}</p>
        </div>
        <div className="px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Status</p>
          <p className="font-medium">{refundStatus || "N/A"}</p>
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
            onClick={handleRefund}
            disabled={refundButtonState.disabled}
            className={`w-full px-3 py-1 text-sm rounded-md transition-colors ${refundButtonState.className}`}
          >
            {refundButtonState.message}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">Order Details</h4>
          <div className="bg-gray-50 rounded-md p-3">
            {/* Order Items */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Item</div>
              <div className="text-gray-500 text-right">Total Price</div>
              {order.items.map((item, index) => (
                <React.Fragment key={index}>
                  <div>
                    {item.name} x{item.quantity}
                  </div>
                  <div className="text-right text-green-600">
                    ${calculateItemTotal(item.price, item.quantity)}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Shipping Details */}
            <div className="mt-4">
              <h5 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-2">Shipping Details</h5>
              <div className="text-sm">
                <p>
                  <span className="text-gray-500">Method:</span> {order.shipping.method}
                </p>
                <p>
                  <span className="text-gray-500">Address:</span> {order.shipping.address}
                </p>
                <p>
                  <span className="text-gray-500">Cost:</span> ${order.shipping.cost.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Total Cost */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h5 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-2">Order Total</h5>
              <p className="text-right font-medium text-green-600 text-lg">
                ${order.total_price.toFixed(2)}
              </p>
            </div>
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
  const { user, logout } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // Fetch orders
        const ordersResponse = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(ordersResponse)
        setOrders(ordersResponse.data.order_history);
        // Fetch wishlist
        const wishlistResponse = await axios.get(process.env.REACT_APP_BACKEND_URL + '/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(wishlistResponse)
        setWishlist(wishlistResponse.data.wishlist);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();  // Call the logout function from AuthContext
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your orders and wishlist.
            </p>
          </div>
          <button
            onClick={handleLogout} // Logout when clicked
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Orders Section */}
          <div>
            <h2 className="text-xl font-medium mb-4">Your Orders</h2>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order, index) => <OrderPanel key={index} order={order} />)
              ) : (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              )}
            </div>
          </div>

          {/* Wishlist Section */}
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
