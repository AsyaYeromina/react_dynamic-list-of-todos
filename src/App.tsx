/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { getTodos, getUser } from './api';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoModal } from './components/TodoModal';
import { User } from './types/User';
import { Loader } from './components/Loader';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [todosLoading, setTodoLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setFilteredTodos(fetchedTodos);
      })
      .catch(error => {
        /* eslint-disable-next-line no-console */
        console.log('Error fetching todos:', error);
      })
      .finally(() => {
        setTodoLoading(false);
      });
  }, []);

  const filterList = (status: FilterStatus, query: string) => {
    const preparedTodos = todos.filter((todo: Todo) => {
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && !todo.completed) ||
        (status === 'completed' && todo.completed);

      const matchesTitle = todo.title
        .trim()
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      return matchesStatus && matchesTitle;
    });

    return preparedTodos;
  };

  const handleFilterChange = (status: FilterStatus, query: string) => {
    const newFilteredTodos = filterList(status, query);

    setFilteredTodos(newFilteredTodos);
  };

  const handleTodoSelection = (todo: Todo) => {
    setSelectedTodo(todo);
    getUser(todo.userId)
      .then(user => {
        setCurrentUser(user);
      })
      .catch(error => {
        /* eslint-disable-next-line no-console */
        console.log('Error fetching todos:', error);
      });
  };

  const handleTodoClear = () => {
    setSelectedTodo(null);
    setCurrentUser(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter onFilterChange={handleFilterChange} />
            </div>

            <div className="block">
              {todosLoading ? (
                <Loader />
              ) : (
                <TodoList
                  todoList={filteredTodos}
                  selectedTodo={selectedTodo}
                  onTodoSelect={handleTodoSelection}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          onTodoClear={handleTodoClear}
          todo={selectedTodo}
          user={currentUser}
        />
      )}
    </>
  );
};
