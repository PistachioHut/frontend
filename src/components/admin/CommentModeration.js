import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Star, StarHalf } from "lucide-react";

// StarRating component for displaying ratings
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} size={16} fill="#22c55e" className="text-green-500" />);
    } else if (i - 0.5 === rating) {
      stars.push(<StarHalf key={i} size={16} fill="#22c55e" className="text-green-500" />);
    } else {
      stars.push(<Star key={i} size={16} className="text-gray-300" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

const CommentModeration = () => {
  const [unapprovedReviews, setUnapprovedReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUnapprovedReviews();
  }, []);

  const fetchUnapprovedReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reviews/unapproved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnapprovedReviews(response.data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (productId, reviewId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/reviews/approve`,
        { product_id: productId, review_id: reviewId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Review approved successfully.");
      fetchUnapprovedReviews(); // Refresh the list after approval
    } catch (err) {
      console.error("Failed to approve review:", err);
      alert("Failed to approve review.");
    }
  };

  const handleDenyReview = async (productId, reviewId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/reviews/deny`,
        { product_id: productId, review_id: reviewId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Review denied successfully.");
      fetchUnapprovedReviews(); // Refresh the list after denial
    } catch (err) {
      console.error("Failed to deny review:", err);
      alert("Failed to deny review.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Review Approval</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      {unapprovedReviews.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-200">Product Name</th>
              <th className="px-4 py-2 border border-gray-200">User ID</th>
              <th className="px-4 py-2 border border-gray-200">Review</th>
              <th className="px-4 py-2 border border-gray-200">Rating</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {unapprovedReviews.map((review) => (
              <tr key={review.review_id} className="border-t">
                <td className="px-4 py-2">{review.product_name}</td>
                <td className="px-4 py-2">{review.user_id}</td>
                <td className="px-4 py-2">{review.content}</td>
                <td className="px-4 py-2">
                  <StarRating rating={review.rating} />
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleApproveReview(review.product_id, review.review_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDenyReview(review.product_id, review.review_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center py-8">No unapproved reviews available</p>
      )}
    </div>
  );
};

export default CommentModeration;
