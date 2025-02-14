import { Button, ButtonGroup, Container, MenuItem, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import BoltIcon from '@mui/icons-material/Bolt';
import { Theme } from '@mui/material/styles';
import { TournamentTypes } from '../types';
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
  const [tournamentName, setTournamentName] = useState('');
  const [selectedType, setSelectedType] = useState(TournamentTypes.STRONGMAN);
  const navigate = useNavigate();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCreateTournament = () => {
    // On confirming creation, you can route to the new tournament component
    alert(`Your Tournament has been created`);
    navigate(`/tournament/${tournamentName}`); // Adjust the route as needed
    handleCloseModal(); // Close the modal
  };
  const handleExistingTournament = () => {
    // Logic for navigating to an existing tournament will go here
    console.log('Navigating to existing tournament...');
  };

  const handleNewTournament = () => {
    handleOpenModal();
  };

  return (
    <Container className={classes.root} maxWidth={false}>
      <Typography variant="h1" className={classes.welcomeText} gutterBottom>
        Tournament Generator
      </Typography>
      <Typography variant="h4" className={classes.subtitleText} gutterBottom>
        Choose an option to get started
      </Typography>
      <ButtonGroup variant="contained" className={classes.buttonGroup}>
        <Button onClick={handleExistingTournament}>Existing Tournament</Button>
        <span className={classes.iconSeparator}>
          <BoltIcon style={{ fontSize: '136px' }} />
        </span>
        <Button onClick={handleNewTournament}>New Tournament</Button>
      </ButtonGroup>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <Typography variant="h6">Create New Tournament</Typography>
          <TextField
            label="Tournament Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Tournament Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TournamentTypes)}
            fullWidth
            margin="normal"
          >
            {Object.values(TournamentTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTournament}
            fullWidth
          >
            Create Tournament
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default LandingPage;
