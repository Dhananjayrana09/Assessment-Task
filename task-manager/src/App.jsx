import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Grid, Container } from '@mui/material';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import AddTaskDialog from './components/AddTaskDialog';
import EditTaskDialog from './components/EditTaskDialog';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1e1e1e',
      paper: '#2d2d2d',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleEditTask = (id, updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleOpenEditDialog = (task) => {
    setEditingTask(task);
    setOpenEditDialog(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar onAddTask={() => setOpenAddDialog(true)} setFilter={setFilter} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container>
            <Grid container spacing={2}>
              <TaskList 
                tasks={filteredTasks} 
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleOpenEditDialog}
              />
            </Grid>
          </Container>
        </Box>
        <AddTaskDialog 
          open={openAddDialog} 
          onClose={() => setOpenAddDialog(false)} 
          onAddTask={handleAddTask}
        />
        <EditTaskDialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)} 
          onEditTask={handleEditTask}
          task={editingTask}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
