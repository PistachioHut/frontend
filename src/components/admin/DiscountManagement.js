import React, { useState, useEffect } from "react";
import axios from "axios";

const DiscountManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedDiscountedPrices, setEditedDiscountedPrices] = useState({}); // Track edited discounted prices

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/all`
        );
        const updatedProducts = response.data.map((product) => ({
          ...product,
          price: Number(product.price), // Ensure price is a number
          discounted_price: Number(product.discounted_price || product.price), // Ensure discounted_price is a number
        }));
        setProducts(updatedProducts);

        // Initialize editedDiscountedPrices with the current discounted prices
        const initialDiscountedPrices = {};
        updatedProducts.forEach((product) => {
          initialDiscountedPrices[product.id] = product.discounted_price;
        });
        setEditedDiscountedPrices(initialDiscountedPrices);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle local discounted price changes
  const handleDiscountedPriceChange = (id, newDiscountedPrice) => {
    setEditedDiscountedPrices((prevPrices) => ({
      ...prevPrices,
      [id]: newDiscountedPrice, // Update only the edited discounted price
    }));
  };

  const handleUpdateDiscountedPrice = async (id) => {
    const newDiscountedPrice = editedDiscountedPrices[id];
    if (!newDiscountedPrice) return;
  
    const updatedData = {
      discounted_price: parseFloat(newDiscountedPrice),
    };
  
    const token = localStorage.getItem("accessToken");
    try {
      // Update the product discounted_price in the backend
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/products/update/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Notify users who have the product wishlisted
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/notify-wishlist-users`,
        { product_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update the product in the state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, discounted_price: parseFloat(newDiscountedPrice) }
            : product
        )
      );
  
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
      <h1 className="text-xl font-bold mb-4">Update Discounted Prices</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200">Product Name</th>
              <th className="px-4 py-2 border border-gray-200">Current Price</th>
              <th className="px-4 py-2 border border-gray-200">
                Current Discounted Price
              </th>
              <th className="px-4 py-2 border border-gray-200">
                New Discounted Price
              </th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border border-gray-200">
                  {product.name}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  ${product.discounted_price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <input
                    type="number"
                    step="0.01"
                    value={editedDiscountedPrices[product.id] || ""}
                    onChange={(e) =>
                      handleDiscountedPriceChange(product.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
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
