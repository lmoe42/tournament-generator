import { Route, Routes } from 'react-router-dom';

import ExistingTournaments from 'components/ExistingTournaments';
import LandingPage from 'components/LandingPage';
import React from 'react';
import Tournament from 'components/Tournament';
import TrophyCeremony from 'components/TrophyCeremony';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tournament/:name" element={<Tournament />} />
      <Route path="/tournament/:name/results" element={<TrophyCeremony />} />
      <Route path="/tournaments" element={<ExistingTournaments />} />
    </Routes>
  );
}
