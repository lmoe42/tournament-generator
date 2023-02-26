import { Route, Routes } from 'react-router-dom';

import AddPlayers from './components/AddPlayers';
import HomeScreen from './components/HomeScreen';
import React from 'react';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/add-players" element={<AddPlayers />} />
    </Routes>
  );
}