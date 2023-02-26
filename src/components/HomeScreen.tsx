import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";

interface Props {
  onCreateTournament: (tournamentName: string, numRounds: number, numKORounds: number) => void;
}

const HomeScreen: React.FC<Props> = ({ onCreateTournament }) => {
  const [tournamentName, setTournamentName] = useState("");
  const [numRounds, setNumRounds] = useState(3);
  const [numKORounds, setNumKORounds] = useState(1);

  const handleCreateTournament = () => {
    onCreateTournament(tournamentName, numRounds, numKORounds);
  };

  return (
    <div>
      <TextField
        label="Tournament Name"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
      />
      <TextField
        label="Number of rounds to collect points"
        type="number"
        value={numRounds}
        onChange={(e) => setNumRounds(parseInt(e.target.value))}
      />
      <TextField
        label="Number of KO rounds after initial phase"
        type="number"
        value={numKORounds}
        onChange={(e) => setNumKORounds(parseInt(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={handleCreateTournament}>
        Create Tournament
      </Button>
    </div>
  );
};

export default HomeScreen;
