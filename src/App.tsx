import { createStyles } from '@mantine/core';
import CalendarView from './components/CalendarView';

const useStyles = createStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    padding: theme.spacing.md,
    height: '100%',
    maxWidth: theme.breakpoints.xl,
    marginInline: 'auto',
  },
}));

function App() {
  const { classes } = useStyles();
  return (
    <div className={classes.mainContainer}>
      <CalendarView />
    </div>
  );
}

export default App;
