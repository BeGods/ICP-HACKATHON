import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const withAuth = (Component) => {
  return (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <Component {...props} />;
  };
};

export default withAuth;
