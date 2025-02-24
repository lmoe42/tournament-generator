import { ThemeProvider, createTheme } from '@mui/material/styles';

import AppRoutes from 'Routes';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles } from '@mui/material';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f2553b',
    },
    secondary: {
      main: '#288918',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
       <GlobalStyles styles={{ 
        body: {
          margin: 0,
          background: `linear-gradient(to right, ${theme.palette.primary.light}, #fcdcd6)`,
          minWidth: '100vw',
          minHeight: '100vh', // Fill the entire height of the viewport
          color: theme.palette.text.primary, // Use theme text color
        },
      }} />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
