import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '../components/sideBar/SideBar';
import DashBoard from './DashBoard';
import Collection from './collection/Collection';
import Users from './Users';
import CollectionDetails from './collection/CollectionDetails';

function Admin() {
  return (
    <div className='flex  min-h-screen'>
      <SideBar />
      <div className="flex-1 mx-auto">
        <Routes>
          <Route path='/dashboard' element={<DashBoard />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/collection/collectionDetails/:id' element={<CollectionDetails/>}/>
          <Route path='/users' element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
