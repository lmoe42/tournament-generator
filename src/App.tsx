import './App.css';

import AppRoutes from 'Routes';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;