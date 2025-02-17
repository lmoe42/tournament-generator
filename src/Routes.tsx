import { Route, Routes } from 'react-router-dom';

import ExistingTournaments from 'components/ExistingTournaments';
import LandingPage from './components/LandingPage';
import React from 'react';
import Tournament from 'components/Tournament';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tournament/:name" element={<Tournament />} />
      <Route path="/tournaments" element={<ExistingTournaments />} />
    </Routes>
  );
}