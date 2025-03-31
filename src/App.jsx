import './css/variables.css';
import './css/base.css';
import './css/app.css';
import './css/form.css'
import './css/navbar.css'

import { Routes, Route } from 'react-router-dom';

import Navbar from './comps/Navbar';
import Home from './comps/Home';
import Form from './comps/Form';
import { useState } from 'react';

function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/form' element={<Form />}/>
    </Routes>
    </>
  )
}

export default App
