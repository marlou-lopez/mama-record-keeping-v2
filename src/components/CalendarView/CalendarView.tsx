import { createStyles, Styles } from '@mantine/core';
import { Calendar, CalendarBaseStylesNames } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import CalendarList from './CalendarList';

const useStyles = createStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    padding: theme.spacing.md,
    height: '100%',
    width: '100%',
    flexWrap: 'wrap',
  },
  calendarContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      alignItems: 'center',
    },
  },
  listViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 2,
  },
}));

const CalendarView = () => {
  const isFullWidth = useMediaQuery('(max-width: 1024px)');
  const { classes } = useStyles();

  const [dateValue, setDateValue] = useState<Date | null>(null);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.calendarContainer}>
        <Calendar
          value={dateValue}
          onChange={setDateValue}
          allowLevelChange={false}
          firstDayOfWeek="sunday"
          fullWidth={isFullWidth}
          size={'xl'}
          styles={(theme) => ({
            calendarBase: {
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                maxWidth: 'initial',
                justifyContent: 'center',
                width: '100%',
              },
            },
            cell: {
              border: `1px solid ${
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            },
            day: {
              borderRadius: 0,
              fontSize: theme.fontSizes.lg,
              height: 70,
              [`@media (min-width: ${theme.breakpoints.md}px)`]: {
                height: 90,
                width: 90,
              },
              [`@media (min-width: ${theme.breakpoints.xl}px)`]: {
                height: 125,
                width: 125,
              },
            },
            weekday: { fontSize: theme.fontSizes.lg },
            weekdayCell: {
              fontSize: theme.fontSizes.xl,
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[0],
              border: `1px solid ${
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              height: 70,
            },
          })}
        />
      </div>
      <div className={classes.listViewContainer}>
        <CalendarList date={dateValue} />
      </div>
    </div>
  );
};

export default CalendarView;
