import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Admin/Admin';
import Login from './Admin/login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CollectionDetail from './pages/CollectionDetail';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/profile' element={<Profile />} />
      <Route path='/collection/:collectionName' element={<CollectionDetail/>}/>
      <Route path='/login' element={<Login />} />
      <Route path='/admin/*' element={<Admin />} />
    </Routes>
  );
}

export default App;
