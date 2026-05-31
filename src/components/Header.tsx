import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import React from 'react';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
        <IconButton edge="start" color="primary" aria-label="home" onClick={handleHomeClick}>
          <HomeIcon />
        </IconButton>
        <Box
          aria-hidden
          sx={{
            alignItems: 'center',
            bgcolor: 'primary.main',
            borderRadius: 2,
            color: 'primary.contrastText',
            display: { xs: 'none', sm: 'flex' },
            fontWeight: 900,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          TG
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
            Tournament Generator
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Strongman workspace
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          startIcon={<TableChartIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          onClick={() => navigate('/tournaments')}
        >
          Turniere
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
