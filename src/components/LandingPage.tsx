import { Button, ButtonGroup, Container, Typography } from '@mui/material';
import React, { useState } from 'react';

import BoltIcon from '@mui/icons-material/Bolt';
import { Theme } from '@mui/material/styles';
import TournamentCreationModal from './TournamentCreationModal';
import TrophySvg from '../assets/trophy.svg';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        textAlign: 'center',
        background: `linear-gradient(to right, ${theme.palette.primary.light}, #fcdcd6)`, // Example gradient background
        color: '#401d1b', // Set text color to white for better contrast
    },
    welcomeText: {
        fontFamily: 'Cursive, Arial, sans-serif', // Example cursive font
        fontSize: '2.5rem',
        fontWeight: 'bold',
    },
    subtitleText: {
        fontSize: '1.2rem',
    },
    buttonGroup: {
        marginTop: '2.5rem',
        '& .MuiButton-root': {
            backgroundColor: theme.palette.primary.main, // Set your desired hex color here
            color: '#fff', // Ensuring the text color is white
            padding: '20px 40px', // Customize button size here
            '&:hover': {
                backgroundColor: theme.palette.primary.dark, // Optional: Customize hover effect color
            },
            width: '300px',
        },
    },
    iconSeparator: {
        display: 'flex',
        alignItems: 'center',
        color: '#fff', // Set icon color to match button text color
        fontSize: '36px', // Set custom size for the icon
        width: '6px',
        height: '48px', // Set a fixed width for spacing
        justifyContent: 'center',
        zIndex: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
        minWidth: '300px',
    },
}));

const LandingPage: React.FC = () => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleExistingTournaments = () => {
    navigate('/tournaments');
  };

  const handleNewTournament = () => {
    handleOpenModal();
  };

  return (
    <Container className={classes.root} maxWidth={false}>
      <img src={TrophySvg} alt="Welcome" style={{ width: '300px', height: 'auto' }} />
      <ButtonGroup variant="contained" className={classes.buttonGroup}>
        <Button onClick={handleExistingTournaments}>Existing Tournaments</Button>
        <span className={classes.iconSeparator}>
          <BoltIcon style={{ fontSize: '136px' }} />
        </span>
        <Button onClick={handleNewTournament}>New Tournament</Button>
      </ButtonGroup>

      <TournamentCreationModal
        open={modalOpen}
        onClose={handleCloseModal}>
      </TournamentCreationModal>
      
    </Container>
  );
};

export default LandingPage;
