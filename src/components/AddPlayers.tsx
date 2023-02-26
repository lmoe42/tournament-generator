import { Button, MenuItem, TextField } from "@material-ui/core";
import React, { useState } from "react";

import { Player } from "types/Player";

// interface Props {
//   onAddPlayers: (players: Player[]) => void;
// }

const AddPlayersScreen = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [skillLevel, setSkillLevel] = useState<"A" | "B">("A");

  const handleAddPlayer = () => {
    if (!name) return;

    const newPlayer = { name, skillLevel };
    setPlayers([...players, newPlayer]);
    setName("");
    setSkillLevel("A");
  };

  const handleStartTournament = () => {
    console.log('player added');
  };

  return (
    <div>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        select
        label="Skill Level"
        value={skillLevel}
        onChange={(e) => setSkillLevel(e.target.value as "A" | "B")}
      >
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="B">B</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" onClick={handleAddPlayer}>
        Add Player
      </Button>
      <Button variant="contained" color="primary" onClick={handleStartTournament}>
        Start Tournament
      </Button>
    </div>
  );
};

export default AddPlayersScreen;
