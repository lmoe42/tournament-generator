import { Box, Button, ButtonGroup, Container } from '@mui/material';
import React, { useState } from 'react';

import BoltIcon from '@mui/icons-material/Bolt';
import TournamentCreationModal from 'components/TournamentCreationModal';
import TrophySvg from 'assets/trophy.svg';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleExistingTournaments = () => {
    navigate('/tournaments');
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        textAlign: 'center',
        color: '#401d1b',
      }}
    >
      <img src={TrophySvg} alt="Tournament trophy icon" style={{ width: '300px', height: 'auto' }} />
      <ButtonGroup
        variant="contained"
        sx={{
          marginTop: '2.5rem',
          '& .MuiButton-root': {
            backgroundColor: 'primary.main',
            color: '#fff',
            padding: '20px 40px',
            width: '300px',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
        }}
      >
        <Button onClick={handleExistingTournaments}>Existing Tournaments</Button>
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            fontSize: '36px',
            width: '6px',
            height: '48px',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <BoltIcon style={{ fontSize: '136px' }} />
        </Box>
        <Button onClick={handleOpenModal}>New Tournament</Button>
      </ButtonGroup>

      <TournamentCreationModal open={modalOpen} onClose={handleCloseModal} />
    </Container>
  );
};

export default LandingPage;
