import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const AdminHeader = () => {
  const { user } = useContext(AuthContext)
  console.log(user)
  return (
    <header className="bg-white shadow">
      <div className="px-4 py-6">
        <p className="mt-1 text-sm text-gray-600">
          Logged in as: {user?.username} ({user?.email}) ({user?.role})
        </p>
      </div>
    </header>
  );
};

export default AdminHeader;