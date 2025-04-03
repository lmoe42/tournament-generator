import React from 'react';
import { Tournament } from 'types';
import TrophyIcon from './TrophyPicture';
import { useParams } from 'react-router-dom';

const TrophyCeremony = () => {
  const { name } = useParams<{ name: string }>(); // Get tournament name from route

  const existingTournaments: Tournament[] = JSON.parse(localStorage.getItem('existingTournaments') || '[]');
  const tournament: Tournament | undefined = existingTournaments.find(
    (tournament: Tournament) => tournament.name === name,
  );

  if (!tournament) {
    return <div className="text-center text-red-500">Tournament not found</div>;
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Podium */}
      <div className="flex justify-center items-end gap-8 mb-8">
        {/* Second place */}
        <div className="flex flex-col items-center">
          <div className="w-48">
            <TrophyIcon color="#C0C0C0" size="100px" />
          </div>
          <p className="mt-2 text-lg font-semibold">{tournament.participants[1]}</p>
        </div>
        {/* First place */}
        <div className="flex flex-col items-center relative" style={{ top: '-20px' }}>
          <div className="w-56">
            <TrophyIcon color="#C0C0C0" size="100px" />
          </div>
          <p className="mt-2 text-lg font-semibold">{tournament.participants[0]}</p>
        </div>
        {/* Third place */}
        <div className="flex flex-col items-center">
          <div className="w-48">
            <TrophyIcon color="#C0C0C0" size="100px" />
          </div>
          <p className="mt-2 text-lg font-semibold">{tournament.participants[2]}</p>
        </div>
      </div>
      {/* Other participants */}
      <ul className="mt-8 text-center">
        {tournament.participants.slice(3).map((participant, index) => (
          <li key={index} className="text-md font-medium mt-1">
            {participant}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrophyCeremony;
