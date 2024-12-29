import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";

const ReturnManagement = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/refunds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefundRequests(response.data.refunds);
    } catch (err) {
      console.error("Failed to fetch refund requests:", err);
      setError("Failed to load refund requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRefund = async (orderId, userEmail) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/refund/accept`,
        { order_id: orderId, user_email: userEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Refund request accepted.");
      fetchRefundRequests();
    } catch (err) {
      console.error("Failed to accept refund request:", err);
      alert("Failed to accept refund request.");
    }
  };

  const handleRejectRefund = async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/refund/reject`,
        { order_id: orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Refund request rejected.");
      fetchRefundRequests();
    } catch (err) {
      console.error("Failed to reject refund request:", err);
      alert("Failed to reject refund request.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Return Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      {refundRequests.length > 0 ? (
        <div className="space-y-4">
          {refundRequests.map((request) => (
            <div key={request.order_id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order #</p>
                  <p className="font-medium">{request.order_id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">User Email</p>
                  <p className="font-medium">{request.user_email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Cost</p>
                  <p className="font-medium text-green-600">${request.order.total_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Shipping Type</p>
                  <p className="font-medium">{request.order.shipping.method}</p>
                </div>
                <div>
                  <button
                    onClick={() => setExpandedRequest(expandedRequest === request.order_id ? null : request.order_id)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Details {expandedRequest === request.order_id ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptRefund(request.order_id, request.user_email)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRefund(request.order_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {expandedRequest === request.order_id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">Order Details</h4>
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Item</div>
                      <div className="text-gray-500 text-right">Total Price</div>
                      {request.order.items.map((item, index) => (
                        <React.Fragment key={index}>
                          <div>
                            {item.name} x{item.quantity}
                          </div>
                          <div className="text-right text-green-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No refund requests available</p>
      )}
    </div>
  );
};

export default ReturnManagement;
