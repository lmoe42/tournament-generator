import { Button, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    maxWidth: 800,
    padding: theme.spacing(2),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
  header: {
    marginBottom: theme.spacing(4),
    textAlign: "center",
  },
}));
// interface Props {
//   onCreateTournament: (tournamentName: string, numRounds: number, numKORounds: number) => void;
// }

const HomeScreen = () => {
  const classes = useStyles();
  const navigate = useNavigate()
  const [tournamentName, setTournamentName] = useState("");
  const [numRounds, setNumRounds] = useState(3);
  const [numKORounds, setNumKORounds] = useState(1);

  const handleCreateTournament = () => {
    navigate('/add-players');
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="h1" className={classes.header}>
        Tournament Generator
      </Typography>
      <Typography variant="body1">
        This application allows you to create and manage sports tournaments. For now, it supports the
        creation of an AB-tournament, where participants are divided into two skill-level groups and
        paired up for each round for teams of two.
      </Typography>
      <Typography variant="body1">
        Below enter the number of preliminary and KO rounds you want and create the tournament to add players. Note that 2^KO-rounds is the number of players qualifying for the elimination phase from the preliminaries. 
      </Typography>
      <TextField
        label="Tournament Name"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
      />
      <TextField
        type="number"
        label="Number of preliminary rounds"
        value={numRounds}
        onChange={(e) => setNumRounds(parseInt(e.target.value))}
      />
      <TextField
        type="number"
        label="Number of KO Rounds"
        value={numKORounds}
        onChange={(e) => setNumKORounds(parseInt(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={handleCreateTournament}>
        Create Tournament and add Players
      </Button>
    </div>
  );
}

export default HomeScreen;
