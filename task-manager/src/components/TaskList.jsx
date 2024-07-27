import React from 'react';
import { Grid, Card, CardContent, Typography, Chip, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }) {
  return tasks.map(task => (
    <Grid item xs={12} sm={6} md={4} key={task.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#424242', color: '#fff' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: '#bdbdbd' }}>
            {task.date}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={task.completed ? "Completed" : "Incomplete"} 
              color={task.completed ? "success" : "error"}
              onClick={() => onToggleComplete(task.id)}
            />
            <Box>
              <IconButton size="small" onClick={() => onEditTask(task)} sx={{ color: '#fff' }}><Edit /></IconButton>
              <IconButton size="small" onClick={() => onDeleteTask(task.id)} sx={{ color: '#fff' }}><Delete /></IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ));
}

export default TaskList;
