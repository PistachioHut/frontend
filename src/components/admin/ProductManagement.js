import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    discounted_price: "",
    category: "",
    description: "",
    dimensions: "",
    distributor_info: "",
    image_link: "",
    model: "",
    popularity: 0,
    quantity_in_stock: "",
    serial_number: "",
    warranty_status: "",
    weight: "",
  });
  const [newCategory, setNewCategory] = useState("");

  const fetchProductsAndCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const productsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const categoriesResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/categories/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(categoriesResponse)
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data.categories);
    } catch (error) {
      console.error("Failed to fetch products and categories:", error);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/products/add`,
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProduct({
        name: "",
        price: "",
        discounted_price: "",
        category: "",
        description: "",
        dimensions: "",
        distributor_info: "",
        image_link: "",
        model: "",
        popularity: 0,
        quantity_in_stock: "",
        serial_number: "",
        warranty_status: "",
        weight: "",
      });
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/products/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/categories/add`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory("");
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleRemoveCategory = async (categoryName) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/categories/remove/${categoryName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Failed to remove category:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-medium mb-2">Add Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddProduct();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(newProduct).map((field) => {
              if (field === "category") {
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <select
                      value={newProduct[field]}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={field.includes("price") || field.includes("quantity") || field.includes("popularity") ? "number" : "text"}
                    value={newProduct[field]}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              );
            })}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-medium mb-2">Add Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add Category
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-medium mb-2">Remove Category</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.name} className="flex items-center mb-2">
              <span className="flex-1">{category.name}</span>
              <button
                onClick={() => handleRemoveCategory(category.name)}
                className="bg-red-500 text-white px-4 py-1 rounded ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-2">Product List</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="flex items-center mb-2">
              <span className="flex-1">{product.name}</span>
              <span className="flex-1">{product.category}</span>
              <span className="flex-1">${product.price}</span>
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="bg-red-500 text-white px-4 py-1 rounded ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
