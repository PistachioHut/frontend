import React, { useState, useEffect } from "react";
import axios from "axios";

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/deliveries/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeliveries(response.data.deliveries);
    } catch (err) {
      console.error("Failed to fetch deliveries:", err);
      setError("Failed to load deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (deliveryId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/deliveries/complete/${deliveryId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Delivery marked as completed!");
      fetchDeliveries(); // Refresh the list
    } catch (err) {
      console.error("Failed to update delivery status:", err);
      alert("Failed to mark delivery as completed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Management</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200">Delivery ID</th>
              <th className="px-4 py-2 border border-gray-200">Customer ID</th>
              <th className="px-4 py-2 border border-gray-200">Product ID</th>
              <th className="px-4 py-2 border border-gray-200">Quantity</th>
              <th className="px-4 py-2 border border-gray-200">Total Price</th>
              <th className="px-4 py-2 border border-gray-200">Delivery Address</th>
              <th className="px-4 py-2 border border-gray-200">Completed</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.delivery_id}>
                <td className="px-4 py-2 border border-gray-200">
                  {delivery.delivery_id}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {delivery.customer_id}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {delivery.product_id}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {delivery.quantity}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  ${delivery.total_price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {delivery.delivery_address}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {delivery.completed ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {!delivery.completed && (
                    <button
                      onClick={() => markAsCompleted(delivery.delivery_id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {delivery.completed && (
                    <span className="text-gray-500">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveryManagement;
