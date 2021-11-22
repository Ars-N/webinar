import { makeStyles } from '@material-ui/core/styles';

export const useTodoItemStyles = makeStyles({
  root: {
    marginTop: 24,
    marginBottom: 24,
  },
  doneRoot: {
    textDecoration: 'line-through',
    color: '#888888',
  },
});

export const useTodoItemListStyles = makeStyles({
  root: {
    listStyle: 'none',
    padding: 0,
  },
});
