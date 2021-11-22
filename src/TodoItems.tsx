import React, { useCallback } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TodoItem, useTodoItems } from './TodoItemsContext';

const spring = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
  duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
  root: {
    listStyle: 'none',
    padding: 0,
  },
});

const reorder = (list: TodoItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const TodoItemsList = function () {
  const { todoItems, dispatch } = useTodoItems();

  const classes = useTodoItemListStyles();

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const newItems = reorder(todoItems, source.index, destination.index);
    dispatch({ type: 'loadState', data: newItems });
  };

  // const sortedItems = todoItems.slice().sort((a, b) => {
  //     if (a.done && !b.done) {
  //         return 1;
  //     }
  //
  //     if (!a.done && b.done) {
  //         return -1;
  //     }
  //
  //     return 0;
  // });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {console.log('todoItems', todoItems)}
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <ul ref={provided.innerRef} className={classes.root} {...provided.droppableProps}>
            {todoItems?.map((item, index) => (
              <motion.li key={item.id} transition={spring} layout>
                <TodoItemCard key={item.id} item={item} index={index} />
              </motion.li>
            ))}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const useTodoItemCardStyles = makeStyles({
  root: {
    marginTop: 24,
    marginBottom: 24,
  },
  doneRoot: {
    textDecoration: 'line-through',
    color: '#888888',
  },
});

export const TodoItemCard = function ({ item, index }: { item: TodoItem; index: number }) {
  const classes = useTodoItemCardStyles();
  const { dispatch } = useTodoItems();

  const handleDelete = useCallback(() => dispatch({ type: 'delete', data: { id: item.id } }), [item.id, dispatch]);

  const handleToggleDone = useCallback(
    () =>
      dispatch({
        type: 'toggleDone',
        data: { id: item.id },
      }),
    [item.id, dispatch],
  );

  return (
    <Draggable draggableId={`card-${item.id}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Card
            className={classnames(classes.root, {
              [classes.doneRoot]: item.done,
            })}
          >
            <CardHeader
              action={
                <IconButton aria-label="delete" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              }
              title={
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.done}
                      onChange={handleToggleDone}
                      name={`checked-${item.id}`}
                      color="primary"
                    />
                  }
                  label={item.title}
                />
              }
            />
            {item.details ? (
              <CardContent>
                <Typography variant="body2" component="p">
                  {item.details}
                </Typography>
              </CardContent>
            ) : null}
          </Card>
        </div>
      )}
    </Draggable>
  );
};
