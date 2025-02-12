import { Button, ButtonGroup, Container, Typography } from '@mui/material';

import BoltIcon from '@mui/icons-material/Bolt';
import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      textAlign: 'center',
      background: 'linear-gradient(to right,rgb(212, 152, 137), #feb47b)', // Example gradient background
      color: '#401d1b',  // Set text color to white for better contrast
    },
    welcomeText: {
      fontFamily: 'Cursive, Arial, sans-serif', // Example cursive font
      fontSize: '2.5rem',
      fontWeight: 'bold',
      italic: true,
    },
    subtitleText: {
      fontSize: '1.2rem',
      marginBottom: '3.5rem',
    },
    buttonGroup: {
        marginTop: '20px',
        '& .MuiButton-root': {
          backgroundColor: '#ff6f20', // Set your desired hex color here
          color: '#fff', // Ensuring the text color is white
          padding: '20px 40px', // Customize button size here
          '&:hover': {
            backgroundColor: '#e65c1e', // Optional: Customize hover effect color
          },
        }
      },
      iconSeparator: {
        display: 'flex',
        alignItems: 'center',
        color: '#fff', // Set icon color to match button text color
        fontSize: '48px', // Set icon size
      },
  });
  
const LandingPage: React.FC = () => {
  const classes = useStyles();
  const handleExistingTournament = () => {
    // Logic for navigating to an existing tournament will go here
    console.log("Navigating to existing tournament...");
  };

  const handleNewTournament = () => {
    // Logic for creating a new tournament will go here
    console.log("Creating a new tournament...");
  };

  return (
    <Container
      className={classes.root}
      maxWidth={false}
    >
      <Typography variant="h1" className={classes.welcomeText} gutterBottom>
        Tournament Generator
      </Typography>
      <Typography variant="h4" className={classes.subtitleText} gutterBottom>
        Choose an option to get started
      </Typography>
      <ButtonGroup variant="contained" className={classes.buttonGroup}>
        <Button onClick={handleExistingTournament}>Existing Tournament</Button>
        <span className={classes.iconSeparator}>
          <BoltIcon />
        </span>
        <Button onClick={handleNewTournament}>New Tournament</Button>
      </ButtonGroup>
    </Container>
  );
};

export default LandingPage;