import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QRPage from './QRPage';
import Descuento from './Descuento';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRPage />} />
        <Route path="/descuento" element={<Descuento />} />
      </Routes>
    </Router>
  );
}

export default App;

