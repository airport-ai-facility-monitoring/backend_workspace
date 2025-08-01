import React from 'react';
import { Box, Container } from '@mui/material';

const SignUpLayout = ({ children }) => (
  <Box
    sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: '#2148c0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      py: 4,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        width: '724px',
        height: '724px',
        bottom: '-359px',
        left: '-362px',
        bgcolor: '#264ec9',
        borderRadius: '50%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '572px',
          height: '572px',
          top: '76px',
          left: '76px',
          bgcolor: '#234bc5',
          borderRadius: '50%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '438px',
            height: '438px',
            top: '67px',
            left: '67px',
            bgcolor: '#274ec7',
            borderRadius: '50%',
          }}
        />
      </Box>
    </Box>
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {children}
      </Box>
    </Container>
  </Box>
);

export default SignUpLayout;
