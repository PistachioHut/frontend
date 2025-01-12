import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SimpleDialog = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>
        <div className="text-gray-600">
          {content}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [dialogContent, setDialogContent] = useState({ isOpen: false, title: '', content: '' });

  const handleDialogOpen = (title, content) => {
    setDialogContent({
      isOpen: true,
      title,
      content
    });
  };

  const dialogContents = {
    shipping: {
      title: 'Shipping Information',
      content: 'We offer worldwide shipping with careful packaging to ensure your pistachios arrive fresh and intact. Standard shipping takes 3-5 business days and is provided free of charge for our valued customers.'
    },
    contact: {
      title: 'Contact Us',
      content: "We're here to help! Reach out to us via email at support@pistachiohut.com or call us at +1 (555) 123-4567. Our customer service team is available Monday through Friday, 9 AM to 6 PM EST."
    },
    privacy: {
      title: 'Return Policy',
      content: 'We offer a generous 30-day return policy for all products. If you are not satisfied with your purchase, please contact us within 30 days of receiving your order. A manager will process your return and refund your purchase price if you qualify.'
    },
    help: {
      title: 'Help Center',
      content: 'Need assistance? Check out our shipping guidelines and return policy. Still have questions? Our customer support team is just a click away.'
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'By using our service, you agree to our terms of service. This includes our shipping policies, return procedures, and product quality guarantees.'
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-2">
            <Link to="/">
              <img src="/assets/images/pistachiohut_logo.png" alt="PistachioHut Logo" className="h-12 mb-4" />
            </Link>
            <p className="text-gray-400">Your natural pistachios.</p>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleDialogOpen(dialogContents.shipping.title, dialogContents.shipping.content)}
                  className="text-gray-400 hover:text-white text-left w-full"
                >
                  Shipping
                </button>
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="font-bold mb-4">Info</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleDialogOpen(dialogContents.help.title, dialogContents.help.content)}
                  className="text-gray-400 hover:text-white text-left w-full"
                >
                  Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDialogOpen(dialogContents.terms.title, dialogContents.terms.content)}
                  className="text-gray-400 hover:text-white text-left w-full"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDialogOpen(dialogContents.privacy.title, dialogContents.privacy.content)}
                  className="text-gray-400 hover:text-white text-left w-full"
                >
                  Privacy Notice
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400">©PISTACHIOHUT All Rights Reserved.</p>
        </div>
      </div>

      {/* SimpleDialog */}
      <SimpleDialog
        isOpen={dialogContent.isOpen}
        onClose={() => setDialogContent({ ...dialogContent, isOpen: false })}
        title={dialogContent.title}
        content={dialogContent.content}
      />
    </footer>
  );
};

export default Footer;
