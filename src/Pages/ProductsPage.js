import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SortAsc } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const AnimatedLoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-green-500 border-dotted rounded-full animate-spin"></div>
      <p className="ml-4 text-lg text-green-700 font-semibold">Loading products...</p>
    </div>
  );
};

const ProductCard = ({ id, name, price, discountedPrice, image, stockCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <div className="mt-1 flex items-center gap-2">
          {discountedPrice < price ? (
            <>
              <span className="text-lg font-semibold text-red-600 line-through relative">
                ${price}
              </span>
              <span className="text-lg font-semibold text-green-600">${discountedPrice}</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-green-600">${price}</span>
          )}
        </div>
      </div>
      {stockCount === 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
          Out of Stock
        </div>
      )}
    </div>
  );
};

const ProductsPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [sortOrder, setSortOrder] = useState('asc'); // Add sort order state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/products/all');
        const productList = response.data;

        const productsWithRatings = [];
        for (const product of productList) {
          try {
            const reviewsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reviews/${product.id}`);
            const reviews = reviewsResponse.data.reviews || [];

            const approvedReviews = reviews.filter((review) => review.approved);
            const averageRating =
              approvedReviews.length > 0
                ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
                : 3;

            productsWithRatings.push({ ...product, averageRating });
          } catch (err) {
            console.error(`Failed to fetch reviews for product ${product.id}:`, err);
            productsWithRatings.push({ ...product, averageRating: 3 });
          }
        }

        setProducts(productsWithRatings);
        localStorage.setItem('products', JSON.stringify(productsWithRatings));
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue;
      switch (sortOption) {
        case 'price':
          compareValue = a.price - b.price;
          break;
        case 'popularity':
          compareValue = a.popularity - b.popularity;
          break;
        case 'rating':
          compareValue = a.averageRating - b.averageRating;
          break;
        case 'category':
          compareValue = a.category.localeCompare(b.category);
          break;
        default:
          compareValue = b.popularity - a.popularity;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue; // Adjust based on sort order
    });

  if (loading) {
    return <AnimatedLoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-gray-900 text-center mb-8">All Products</h1>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <SortAsc size={20} className="text-gray-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="recommended">Default</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="category">Category</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              discountedPrice={product.discounted_price || product.price} // Default to price if no discount
              image={product.image_link}
              stockCount={product.stockCount}
            />
          ))}
        </div>


        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found matching your search.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
