import React from 'react';
import { 
  Box, List, ListItem, ListItemIcon, ListItemText, Avatar, 
  Typography, Divider, Button 
} from '@mui/material';
import { Home, CheckCircle, PlayArrow, ExitToApp, Add } from '@mui/icons-material';

function Sidebar({ onAddTask, setFilter }) {
  return (
    <Box sx={{ width: 240, backgroundColor: 'background.paper', position: 'relative' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2 }}>D</Avatar>
        <Typography variant="subtitle1">Dhananjay Pundir</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => setFilter('all')}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="All Tasks" />
        </ListItem>
        <ListItem button onClick={() => setFilter('completed')}>
          <ListItemIcon><CheckCircle /></ListItemIcon>
          <ListItemText primary="Completed" />
        </ListItem>
        <ListItem button onClick={() => setFilter('incomplete')}>
          <ListItemIcon><PlayArrow /></ListItemIcon>
          <ListItemText primary="Incomplete" />
        </ListItem>
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          fullWidth
          onClick={onAddTask}
          sx={{ mb: 1 }}
        >
          Add New Task
        </Button>
        <Button 
          variant="text" 
          startIcon={<ExitToApp />} 
          fullWidth 
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}

export default Sidebar;


