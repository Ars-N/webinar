import { TodoItem, useTodoItems } from '../TodoItemsContext';
import React, { useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import classnames from 'classnames';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useTodoItemStyles } from '../hooks/useTodoItemStyles';

const TodoItemCard = function ({ item, index }: { item: TodoItem; index: number }) {
  const classes = useTodoItemStyles();
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
      {provided => (
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
export default TodoItemCard;
