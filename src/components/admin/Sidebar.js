// src/components/admin/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  const productManagerLinks = [
    { path: 'products', label: 'Products' },
    { path: 'stock', label: 'Stock' },
    { path: 'deliveries', label: 'Deliveries' },
    { path: 'comments', label: 'Comments' }
  ];

  const salesManagerLinks = [
    { path: 'pricing', label: 'Pricing' },
    { path: 'discounts', label: 'Discounts' },
    { path: 'invoices', label: 'Invoices' },
    { path: 'analytics', label: 'Analytics' },
    { path: 'returns', label: 'Returns' }
  ];

  const links = userRole === 'Product Manager' ? productManagerLinks : salesManagerLinks;

  return (
    <nav className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="space-y-4">
        {links.map(link => (
          <Link
            key={link.path}
            to={`/admin/${link.path}`}
            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;