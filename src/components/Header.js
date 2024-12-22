import React, { useContext, useState } from 'react';
import { User, ShoppingCart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

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
          {content.split('\n').map((line, index) => (
            <p key={index} className="mb-2">
              {line.trim()}
            </p>
          ))}
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

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ isOpen: false, title: '', content: '' });

  const handleDialogClose = () => {
    setDialogContent({ ...dialogContent, isOpen: false });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
            {(user?.role=="Sales Manager" || user?.role=="Product Manager")?<Link to="/admin" className="text-gray-700 hover:text-green-600">Admin Page</Link>:""}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                  >
                    <User className="w-6 h-6" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-gray-700 hover:text-green-600">
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
            <Link to="/cart">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600" />
            </Link>
          </div>
        </div>
      </header>
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