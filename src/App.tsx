import './App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import AppRoutes from 'Routes';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
