import React, { useState, useEffect } from "react";
import axios from "axios";

const PriceManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editedPrices, setEditedPrices] = useState({}); // Track edited prices

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

        // Initialize editedPrices with the current prices
        const initialPrices = {};
        updatedProducts.forEach((product) => {
          initialPrices[product.id] = product.price;
        });
        setEditedPrices(initialPrices);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle local price changes
  const handlePriceChange = (id, newPrice) => {
    setEditedPrices((prevPrices) => ({
      ...prevPrices,
      [id]: newPrice, // Update only the edited price
    }));
  };

  // Send updated price to the backend
  const handleUpdatePrice = async (id) => {
    const newPrice = editedPrices[id];
    if (!newPrice) return; // Do nothing if no new price is entered

    const product = products.find((p) => p.id === id);
    const updatedData = {
      price: parseFloat(newPrice),
    };

    // Check if the new price is lower than discounted_price
    if (newPrice < product.discounted_price) {
      updatedData.discounted_price = parseFloat(newPrice);
    }
    const token = localStorage.getItem('accessToken');
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/products/update/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update the product price and discounted_price in the state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? {
                ...product,
                price: parseFloat(newPrice),
                discounted_price:
                  newPrice < product.discounted_price
                    ? parseFloat(newPrice)
                    : product.discounted_price,
              }
            : product
        )
      );

    } catch (err) {
      console.error("Failed to update price:", err);
      alert("Failed to update price.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Update Product Prices</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200">Product Name</th>
              <th className="px-4 py-2 border border-gray-200">Current Price</th>
              <th className="px-4 py-2 border border-gray-200">
                Discounted Price
              </th>
              <th className="px-4 py-2 border border-gray-200">New Price</th>
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
                    value={editedPrices[product.id] || ""}
                    onChange={(e) =>
                      handlePriceChange(product.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <button
                    onClick={() => handleUpdatePrice(product.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default PriceManagement;
