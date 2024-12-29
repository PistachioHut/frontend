import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FileText } from "lucide-react";

const InvoiceManagement = () => {
  const [startDate, setStartDate] = useState("2024-01-01"); // Start from a far past date
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format today's date as "YYYY-MM-DD"
  });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/invoices`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      setInvoices(response.data);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Invoice Management</h1>

      <div className="flex items-center space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          onClick={fetchInvoices}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Fetch Invoices
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && invoices.length > 0 && (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200">Order ID</th>
              <th className="px-4 py-2 border border-gray-200">User Email</th>
              <th className="px-4 py-2 border border-gray-200">Order Date</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-2 border border-gray-200">{invoice.order_id}</td>
                <td className="px-4 py-2 border border-gray-200">{invoice.user_email}</td>
                <td className="px-4 py-2 border border-gray-200">
                  {format(new Date(invoice.order_date), "PPP p")}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  <button
                    onClick={() => handleViewInvoice(invoice.receipt_url)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="inline w-5 h-5" /> View
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

export default InvoiceManagement;
