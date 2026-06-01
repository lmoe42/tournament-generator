import { Route, Routes } from 'react-router-dom';

import ExistingTournaments from 'components/tournaments/ExistingTournaments';
import LandingPage from 'components/app/LandingPage';
import React from 'react';
import Tournament from 'components/tournaments/Tournament';
import TrophyCeremony from 'components/tournaments/TrophyCeremony';

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
