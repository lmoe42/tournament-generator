import { CssBaseline, GlobalStyles } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AppRoutes from 'Routes';
import { BrowserRouter } from 'react-router-dom';
import Box from '@mui/material/Box';
import Header from 'components/app/Header';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2a702c',
      light: '#4a9c4d',
      dark: '#133a14',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9a6598',
      light: '#f5edf4',
      dark: '#744572',
      contrastText: '#fff',
    },
    background: {
      default: '#f6f8f5',
      paper: '#fff',
    },
    text: {
      primary: '#1a231b',
      secondary: '#5f6d5f',
    },
    divider: '#dfe2df',
    error: {
      main: '#b42318',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 800,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#dfe2df',
        },
        head: {
          color: '#5f6d5f',
          fontSize: '0.75rem',
          fontWeight: 800,
          textTransform: 'uppercase',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*': {
            boxSizing: 'border-box',
          },
          body: {
            margin: 0,
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          '#root': {
            minHeight: '100vh',
          },
        }}
      />
      <BrowserRouter>
        <Header />
        <Box component="main" sx={{ minHeight: '100vh', pt: { xs: '56px', sm: '64px' } }}>
          <AppRoutes />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
