import { Card, CardContent, IconButton, Typography } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TournamentOverviewProps {
  name: string;
  type: string;
  participantsCount: number;
}

const TournamentOverview: React.FC<TournamentOverviewProps> = ({ name, type, participantsCount }) => {
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    navigate(`/tournament/${name}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    const confirmDelete = window.confirm(`Are you sure you want to delete the tournament "${name}"?`);
    
    if (confirmDelete) {
      const existingTournaments = JSON.parse(localStorage.getItem('existingTournaments') || '[]');
      
      const updatedTournaments = existingTournaments.filter((tournament: { name: string }) => tournament.name !== name);
      
      localStorage.setItem('existingTournaments', JSON.stringify(updatedTournaments));
      window.location.reload();
    }
  };

  return (
    <Card variant="outlined" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <CardContent>
        <IconButton 
          aria-label="delete" 
          onClick={handleDelete} 
          style={{ float: 'right' }}
        >
          <DeleteIcon color="error" />
        </IconButton>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Type: {type}
        </Typography>
        <Typography variant="body2">
          Participants: {participantsCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TournamentOverview;