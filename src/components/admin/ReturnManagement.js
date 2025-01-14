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

  const handleAcceptRefund = async (order_id, userEmail, productId) => {
    try {
      const token = localStorage.getItem("accessToken");
  
      // Process refund
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/refund/accept`,
        { order_id, user_email: userEmail, product_id: productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Find the refund request
      const refundRequest = refundRequests.find(
        (request) => request.product_id === productId && request.order_id === order_id
      );
  
      if (refundRequest) {
        // Increment stock for the refunded product
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/products/stock/increase/${productId}`,
          { quantity: refundRequest.product.quantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        // Decrease popularity for the refunded product
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/products/popularity/decrease/${productId}`,
          { quantity: refundRequest.product.quantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      // Send refund email
      await handleSendRefundEmail(userEmail, order_id, productId);
  
      alert("Refund request accepted, stock updated, popularity decreased, and email sent.");
      fetchRefundRequests();
    } catch (err) {
      console.error("Order Refunded Succesfully.", err);
      alert("Order Refunded Succesfully.");
    }
  };
  
  

  const handleSendRefundEmail = async (email, order_id, productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const refundRequest = refundRequests.find(
        (request) => request.product_id === productId && request.order_id === order_id
      );

      if (!refundRequest) throw new Error("Refund request not found");

      const totalCost = (refundRequest.product.price * refundRequest.product.quantity).toFixed(2);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/send-refund-email`,
        {
          email,
          subject: "Refund Confirmation",
          content: `
            <p>Dear Customer,</p>
            <p>Your refund for the product <strong>${refundRequest.product.name}</strong> (Quantity: ${refundRequest.product.quantity}) has been processed.</p>
            <p>Total Refunded Amount: <strong>$${totalCost}</strong></p>
            <p>Thank you for shopping with us.</p>
          `,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Refund email sent successfully.");
    } catch (err) {
      console.error("Failed to send refund email:", err);
      alert("Refund email could not be sent.");
    }
  };

  const handleRejectRefund = async (order_id, product_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/refund/reject`,
        { order_id, product_id },
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
          {refundRequests.map((request) => {
  const uniqueId = `${request.order_id}-${request.product_id}`; // Generate a unique ID for each refund request
  return (
    <div key={uniqueId} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Product Name</p>
          <p className="font-medium">{request.product.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">User Email</p>
          <p className="font-medium">{request.user_email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Quantity</p>
          <p className="font-medium">{request.product.quantity}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Refund Status</p>
          <p className="font-medium">{request.product.refund_processing}</p>
        </div>
        <div>
          <button
            onClick={() =>
              setExpandedRequest(expandedRequest === uniqueId ? null : uniqueId)
            }
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Details {expandedRequest === uniqueId ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAcceptRefund(request.order_id, request.user_email, request.product_id)}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleRejectRefund(request.order_id, request.product_id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
      {expandedRequest === uniqueId && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-medium mb-2 text-sm uppercase tracking-wider text-gray-500">Product Details</h4>
          <div className="bg-gray-50 rounded-md p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Image</div>
              <div className="text-right">
                <img
                  src={request.product.image_link}
                  alt={request.product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
              <div className="text-gray-500">Price</div>
              <div className="text-right text-green-600">${request.product.price}</div>
              <div className="text-gray-500">Total</div>
              <div className="text-right text-green-600">
                ${(request.product.price * request.product.quantity).toFixed(2)}
              </div>
              <div className="text-gray-500">Request Date</div>
              <div className="text-right">{new Date(request.request_date).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
})}

        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No refund requests available</p>
      )}
    </div>
  );
};

export default ReturnManagement;
