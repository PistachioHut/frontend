import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, userLoading } = useContext(AuthContext)

  if (userLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    console.log(user)
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    console.log(user.role)
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;