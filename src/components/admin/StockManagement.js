import React, { useState, useEffect } from "react";
import axios from "axios";

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [editedStock, setEditedStock] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(response.data);
      const initialStock = {};
      response.data.forEach((product) => {
        initialStock[product.id] = product.quantity_in_stock;
      });
      setEditedStock(initialStock);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, newStock) => {
    setEditedStock((prev) => ({
      ...prev,
      [id]: newStock,
    }));
  };

  const handleUpdateStock = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/products/stock/update/${id}`,
        { quantity_in_stock: parseInt(editedStock[id], 10) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Stock updated successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Failed to update stock. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Stock Management</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200">Product Name</th>
              <th className="px-4 py-2 border border-gray-200">Current Stock</th>
              <th className="px-4 py-2 border border-gray-200">New Stock</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border border-gray-200">{product.name}</td>
                <td className="px-4 py-2 border border-gray-200">
                  {product.quantity_in_stock}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <input
                    type="number"
                    value={editedStock[product.id] || ""}
                    onChange={(e) =>
                      handleStockChange(product.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <button
                    onClick={() => handleUpdateStock(product.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockManagement;
