import { Route, Routes } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import React from 'react';
import Tournament from 'components/Tournament';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tournament/:name" element={<Tournament />} />
    </Routes>
  );
}