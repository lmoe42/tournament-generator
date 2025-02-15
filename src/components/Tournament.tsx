// src/components/Tournament.tsx

import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

// Define a TypeScript interface for route parameters
interface RouteParams {
  [key: string]: string | undefined;
  name?: string;
}

const Tournament: React.FC = () => {
  const { name } = useParams<RouteParams>();

  return (
    <div>
      <Typography variant="h4">Tournament Details</Typography>
      <Typography variant="h6">Tournament Name: {name}</Typography> 
    </div>
  );
};

export default Tournament;