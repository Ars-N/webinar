import { TodoItem, useTodoItems } from '../TodoItemsContext';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import React from 'react';
import TodoItemCard from '../TodoItemCard';
import { useTodoItemListStyles } from '../hooks/useTodoItemStyles';

const spring = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
  duration: 0.25,
};

const reorder = (list: TodoItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const TodoItemsList = function () {
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
      <Droppable droppableId="droppable-list">
        {provided => (
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

export default TodoItemsList;
