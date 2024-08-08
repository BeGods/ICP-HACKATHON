import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../components/sideBar/SideBar';
import DashBoard from './DashBoard';
import Collection from './collection/Collection';
import Users from './Users';
import CollectionDetails from './collection/CollectionDetails';
import NftDetails from './collection/NftDetails';
import CreateCollection from './collection/CreateCollection';
import UserDetails from './UserDetails';
import { Icon } from '@chakra-ui/react';
import { MdMenu } from "react-icons/md";

function Admin() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='flex min-h-screen'>
      <SideBar/>
      <div className="flex-1 mx-auto">
        <Routes>
          <Route path='/dashboard' element={<DashBoard />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/collection/create' element={<CreateCollection />} />
          <Route path='/collection/collectionDetails/:id' element={<CollectionDetails />} />
          <Route path='/collection/collectionDetails/:id/nft/:id' element={<NftDetails />} />
          <Route path='/users/' element={<Users />} />
          <Route path='/users/:id' element={<UserDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
