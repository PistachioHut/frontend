import React, { useState } from 'react';
import { User, ShoppingCart } from 'lucide-react';
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

const dialogContents = {
  about: {
    title: 'About PistachioHut',
    content: `At PistachioHut, we're dedicated to bringing you the finest pistachios from our carefully maintained orchards. Our journey began with a simple mission: to provide the highest quality pistachios while maintaining sustainable and ethical farming practices.

    Our pistachios are grown in the fertile regions of Siirt, where the unique climate and soil conditions create the perfect environment for producing the most flavorful nuts. We take pride in our:

    • Traditional farming methods combined with modern sustainable practices
    • Rigorous quality control at every stage of production
    • Direct partnerships with local farmers
    • Commitment to environmental stewardship

    Every package of PistachioHut pistachios represents our dedication to quality, sustainability, and the rich agricultural heritage of our region.`
  },
  contact: {
    title: 'Contact Us',
    content: `We'd love to hear from you! Here's how you can reach us:

    📧 Email: support@pistachiohut.com
    📞 Phone: +1 (555) 123-4567
    
    Customer Service Hours:
    Monday - Friday: 9:00 AM - 6:00 PM EST
    
    Business Address:
    PistachioHut Headquarters
    123 Pistachio Lane
    Siirt, Turkey

    For wholesale inquiries, please email: wholesale@pistachiohut.com
    
    We aim to respond to all inquiries within 24 hours during business days.`
  }
};

const Header = () => {
  const [dialogContent, setDialogContent] = useState({ isOpen: false, title: '', content: '' });

  const handleDialogOpen = (type) => {
    setDialogContent({
      isOpen: true,
      title: dialogContents[type].title,
      content: dialogContents[type].content
    });
  };

  const handleDialogClose = () => {
    setDialogContent({ ...dialogContent, isOpen: false });
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 h-[72px]">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link to="/">
          <img src="/assets/images/pistachiohut_logo.png" alt="PistachioHut Logo" className="h-12" />
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/products" className="text-gray-700 hover:text-green-600">Products</Link>
          <Link to="/about" className="text-gray-700 hover:text-green-600">About Us</Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-600">Contact</Link>
        </nav>
        <div className="flex space-x-4">
          <Link to="/login">
            <User className="w-6 h-6 text-gray-700" />
          </Link>
          <Link to="/cart">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
      {/* Add a spacer div that's the same height as the header */}
      <div className="h-[72px] w-full"></div>
      
      <SimpleDialog 
        isOpen={dialogContent.isOpen}
        onClose={handleDialogClose}
        title={dialogContent.title}
        content={dialogContent.content}
      />
    </>
  );
};

export default Header;