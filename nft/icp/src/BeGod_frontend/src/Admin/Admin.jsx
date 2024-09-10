import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import DashBoard from './DashBoard';
import Collection from './collection/Collection';
import Users from './Users';
import CollectionDetails from './collection/CollectionDetails';
import NftDetails from './collection/NftDetails';
import CreateCollection from './collection/CreateCollection';
import UserDetails from './UserDetails';
import PageNotFound from './PageNotFound';

function Admin() {
  const [isOpen, setIsOpen] = useState(false);

  // Access the authentication state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Conditional rendering based on isAuthenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to the login page if not authenticated
  }

  return (
    <div className='flex flex-col items-start justify-center lg:flex-row md:flex-row sm:flex-col'>
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} className="" />
      <div className="flex items-center justify-center w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path='/dashboard' element={<DashBoard />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/collection/create' element={<CreateCollection />} />
          <Route path='/collection/collectionDetails/:id' element={<CollectionDetails />} />
          <Route path='/collection/collectionDetails/:collectionId/nft/:nftId' element={<NftDetails />} />
          <Route path='/users/' element={<Users />} />
          <Route path='/users/:id' element={<UserDetails />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
