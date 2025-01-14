import React, { useState, useEffect } from "react";
import axios from "axios";

const DiscountManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedDiscountPercentages, setEditedDiscountPercentages] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/all`);
        const updatedProducts = response.data.map((product) => ({
          ...product,
          price: Number(product.price),
          discounted_price: Number(product.discounted_price || product.price),
        }));
        setProducts(updatedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refreshProductData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/all`);
      const updatedProducts = response.data.map((product) => ({
        ...product,
        price: Number(product.price),
        discounted_price: Number(product.discounted_price || product.price),
      }));
      setProducts(updatedProducts);
    } catch (err) {
      console.error("Failed to refresh products:", err);
    }
  };

  const handleDiscountPercentageChange = (id, percentage) => {
    setEditedDiscountPercentages((prev) => ({
      ...prev,
      [id]: percentage,
    }));
  };

  const handleUpdateDiscountedPrice = async (id) => {
    const discountPercentage = editedDiscountPercentages[id];
    if (!discountPercentage) return;
  
    const product = products.find((p) => p.id === id);
    const newDiscountedPrice = (product.price * (1 - discountPercentage / 100)).toFixed(2);
  
    const updatedData = {
      discounted_price: parseFloat(newDiscountedPrice),
    };
  
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/products/update/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/notify-wishlist-users`,
        { product_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, discounted_price: parseFloat(newDiscountedPrice) }
            : product
        )
      );
  
      // Clear the input field for this product
      setEditedDiscountPercentages((prev) => ({
        ...prev,
        [id]: "",
      }));
  
      alert("Discount updated and users notified successfully.");
    } catch (err) {
      console.error("Failed to update discounted price or notify users:", err);
      alert("Failed to update discounted price or notify users.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Update Discounts</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200">Product Name</th>
              <th className="px-4 py-2 border border-gray-200">Current Price</th>
              <th className="px-4 py-2 border border-gray-200">Current Discounted Price</th>
              <th className="px-4 py-2 border border-gray-200">Discount %</th>
              <th className="px-4 py-2 border border-gray-200">Calculated Discounted Price</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border border-gray-200">{product.name}</td>
                <td className="px-4 py-2 border border-gray-200">${product.price.toFixed(2)}</td>
                <td className="px-4 py-2 border border-gray-200">${product.discounted_price.toFixed(2)}</td>
                <td className="px-4 py-2 border border-gray-200">
                  <input
                    type="number"
                    step="1"
                    value={editedDiscountPercentages[product.id] || ""}
                    onChange={(e) => handleDiscountPercentageChange(product.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                    placeholder="Discount %"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  ${((product.price * (1 - (editedDiscountPercentages[product.id] || 0) / 100)) || product.price).toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <button
                    onClick={() => handleUpdateDiscountedPrice(product.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Update
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

export default DiscountManagement;
