import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { forceClearAllTokens, cleanupInvalidTokens, isAuthenticated } from '../../utils/tokenUtils.jsx';

const TokenDebug = () => {
  const handleForceClear = () => {
    forceClearAllTokens();
    window.location.reload();
  };

  const handleCleanup = () => {
    cleanupInvalidTokens();
    window.location.reload();
  };

  const handleCheckStatus = () => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    console.log('=== Token Debug Info ===');
    console.log('Access Token:', token ? `${token.substring(0, 20)}...` : 'None');
    console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None');
    console.log('Is Authenticated:', isAuthenticated());
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('========================');
  };

  return (
    <Paper sx={{ p: 2, m: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Token Debug Tools
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use these tools if you're experiencing authentication issues
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleCheckStatus}
        >
          Check Token Status
        </Button>
        
        <Button 
          variant="outlined" 
          color="warning" 
          onClick={handleCleanup}
        >
          Clean Invalid Tokens
        </Button>
        
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleForceClear}
        >
          Force Clear All Tokens
        </Button>
      </Box>
      
      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        Check the browser console for detailed token information
      </Typography>
    </Paper>
  );
};

export default TokenDebug;
