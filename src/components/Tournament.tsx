// src/components/Tournament.tsx

// import React from 'react';
// import { Typography } from '@mui/material';
// import { useParams } from 'react-router-dom';

// // Define a TypeScript interface for route parameters
// interface RouteParams {
//   [key: string]: string | undefined;
//   name?: string;
// }

// const Tournament: React.FC = () => {
//   const { name } = useParams<RouteParams>();

//   return (
//     <div>
//       <Typography variant="h4">Tournament Details</Typography>
//       <Typography variant="h6">Tournament Name: {name}</Typography> 
//     </div>
//   );
// };

// export default Tournament;

import React from 'react';
import StrongmanTournamentComponent from './StrongmanTournamentComponent'; // Import other tournament components as needed
import { useParams } from 'react-router-dom';
import { type StrongmanTournament, TournamentTypes, type Tournament } from '../types';

const Tournament: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // Get tournament name from route

  const existingTournaments: Tournament[] = JSON.parse(localStorage.getItem('existingTournaments') || '[]'); 
  const selectedTournament = existingTournaments.find((tournament: Tournament) => tournament.name === name);

  // Function to render the correct tournament type component
  const renderTournamentComponent = () => {
    switch (selectedTournament?.type) {
      case TournamentTypes.STRONGMAN:
        return <StrongmanTournamentComponent tournament={selectedTournament as StrongmanTournament} />;
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