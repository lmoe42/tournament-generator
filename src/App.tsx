import HomeScreen from 'components/HomeScreen';
import React from 'react';

function App() {

  const handleCreateTournament = (tournamentName: string) => {
    // Perform any action that needs to be taken when a tournament is created
    console.log(`A new tournament named ${tournamentName} has been created!`);
  }

  return (
    <div className="App">
      <HomeScreen onCreateTournament={handleCreateTournament}/>
    </div>
  );
}

export default App;