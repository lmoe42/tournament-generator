import { Route, Routes } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import React from 'react';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}