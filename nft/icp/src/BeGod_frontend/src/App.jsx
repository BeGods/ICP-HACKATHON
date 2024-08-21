import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Admin/Admin';
import Login from './components/login';
import Home from './components/Home';

function App() {
  return (
    <main className=''>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
