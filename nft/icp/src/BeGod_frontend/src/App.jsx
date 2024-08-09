import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Admin/Admin';
import Login from './components/login';

function App() {
  return (
    <main className='max-w-[1920px] mx-auto'>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
