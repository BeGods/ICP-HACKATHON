// components/ProtectedLayout.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import SideBar from './sideBar/SideBar';

const ProtectedLayout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='flex min-h-screen'>
      <SideBar />
      <div className="flex-1 mx-auto">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
