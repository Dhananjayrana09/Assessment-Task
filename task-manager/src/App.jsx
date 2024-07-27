// import React, { useState, useEffect } from 'react';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { Box, Grid, Container } from '@mui/material';
// import Sidebar from './components/Sidebar';
// import TaskList from './components/TaskList';
// import AddTaskDialog from './components/AddTaskDialog';
// import EditTaskDialog from './components/EditTaskDialog';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     background: {
//       default: '#1e1e1e',
//       paper: '#2d2d2d',
//     },
//   },
//   typography: {
//     fontFamily: 'Roboto, sans-serif',
//   },
// });

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
//     console.log('Loaded tasks from local storage:', storedTasks); // Debug log
//     setTasks(storedTasks);
//   }, []);

//   useEffect(() => {
//     console.log('Saving tasks to local storage:', tasks); // Debug log
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//   }, [tasks]);

//   const handleAddTask = (newTask) => {
//     const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
//     console.log('Adding task:', newTask); // Debug log
//     setTasks(updatedTasks);
//   };

//   const handleToggleComplete = (id) => {
//     const updatedTasks = tasks.map(task => 
//       task.id === id ? { ...task, completed: !task.completed } : task
//     );
//     console.log('Toggling complete for task ID:', id); // Debug log
//     setTasks(updatedTasks);
//   };

//   const handleDeleteTask = (id) => {
//     const updatedTasks = tasks.filter(task => task.id !== id);
//     console.log('Deleting task ID:', id); // Debug log
//     setTasks(updatedTasks);
//   };

//   const handleEditTask = (id, updatedTask) => {
//     const updatedTasks = tasks.map(task => 
//       task.id === id ? { ...task, ...updatedTask } : task
//     );
//     console.log('Editing task ID:', id, 'with data:', updatedTask); // Debug log
//     setTasks(updatedTasks);
//   };

//   const handleOpenEditDialog = (task) => {
//     setEditingTask(task);
//     setOpenEditDialog(true);
//   };

//   const filteredTasks = tasks.filter(task => {
//     if (filter === 'completed') return task.completed;
//     if (filter === 'incomplete') return !task.completed;
//     return true;
//   });

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <Box sx={{ display: 'flex', height: '100vh' }}>
//         <Sidebar onAddTask={() => setOpenAddDialog(true)} setFilter={setFilter} />
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Container>
//             <Grid container spacing={2}>
//               <TaskList 
//                 tasks={filteredTasks} 
//                 onToggleComplete={handleToggleComplete}
//                 onDeleteTask={handleDeleteTask}
//                 onEditTask={handleOpenEditDialog}
//               />
//             </Grid>
//           </Container>
//         </Box>
//         <AddTaskDialog 
//           open={openAddDialog} 
//           onClose={() => setOpenAddDialog(false)} 
//           onAddTask={handleAddTask}
//         />
//         <EditTaskDialog 
//           open={openEditDialog} 
//           onClose={() => setOpenEditDialog(false)} 
//           onEditTask={handleEditTask}
//           task={editingTask}
//         />
//       </Box>
//     </ThemeProvider>
//   );
// }

// export default App;


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
    const dbName = 'TaskManagerDB';
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['tasks'], 'readonly');
      const objectStore = transaction.objectStore('tasks');
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        const storedTasks = event.target.result;
        console.log('Loaded tasks from IndexedDB:', storedTasks); // Debug log
        setTasks(storedTasks);
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('tasks', { keyPath: 'id' });
    };
  }, []);

  const saveTasks = (updatedTasks) => {
    const dbName = 'TaskManagerDB';
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['tasks'], 'readwrite');
      const objectStore = transaction.objectStore('tasks');

      // Clear existing tasks
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        // Add all tasks
        updatedTasks.forEach((task) => {
          objectStore.add(task);
        });
      };

      transaction.oncomplete = () => {
        console.log('Saving tasks to IndexedDB:', updatedTasks); // Debug log
        setTasks(updatedTasks);
      };
    };
  };

  const handleAddTask = (newTask) => {
    const updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
    console.log('Adding task:', newTask); // Debug log
    saveTasks(updatedTasks);
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    console.log('Toggling complete for task ID:', id); // Debug log
    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    console.log('Deleting task ID:', id); // Debug log
    saveTasks(updatedTasks);
  };

  const handleEditTask = (id, updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    );
    console.log('Editing task ID:', id, 'with data:', updatedTask); // Debug log
    saveTasks(updatedTasks);
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