import React from 'react';
import StrongmanTournamentComponent from './TorunamentStrongman'; // Import other tournament components as needed
import { useParams } from 'react-router-dom';
import {  TournamentTypes, type Tournament } from '../types';

const Tournament: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // Get tournament name from route

  const existingTournaments: Tournament[] = JSON.parse(localStorage.getItem('existingTournaments') || '[]'); 
  const selectedTournament = existingTournaments.find((tournament: Tournament) => tournament.name === name);

  // Function to render the correct tournament type component
  const renderTournamentComponent = () => {
    switch (selectedTournament?.type) {
      case TournamentTypes.STRONGMAN:
        return <StrongmanTournamentComponent tournament={ selectedTournament } />;
      // You can add more cases for other tournament types
      default:
        return <div>No tournament type found.</div>; // Fallback UI
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {renderTournamentComponent()} {/* Render the appropriate tournament component */}
    </div>
  );
};

export default Tournament;