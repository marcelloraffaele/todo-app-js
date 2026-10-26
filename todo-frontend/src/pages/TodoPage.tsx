import { useState, useEffect } from 'react'
import { TodoService, Todo } from '../services/TodoService'
import { ErrorMessage } from '../components/ErrorMessage'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'

export const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [todoService] = useState(() => new TodoService());

  useEffect(() => {
    let active = true;
    todoService.getAllTodos().then(
      fetchedTodos => {
        if (active) {
          setTodos(fetchedTodos);
          setError(null);
          setLoading(false);
        }
      },
      () => {
        if (active) {
          setError('Failed to load todos');
          setLoading(false);
        }
      }
    );
    return () => { active = false; };
  }, [todoService]);

  const handleAddTodo = async (newTodo: Omit<Todo, 'id' | 'creationDate'>) => {
    try {
      const todo = await todoService.createTodo(newTodo);
      setTodos([...todos, todo]);
      setError(null);
    } catch {
      setError('Failed to add todo');
    }
  };

  const handleUpdateTodoState = async (id: number, state: 'done' | 'active' | 'canceled') => {
    try {
      await todoService.updateTodo(id, { state });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, state } : todo
      ));
      setError(null);
    } catch {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch {
      setError('Failed to delete todo');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Todo List</h1>
      <ErrorMessage message={error} />
      <TodoForm onSubmit={handleAddTodo} />
      
      <TodoList 
        todos={todos}
        loading={loading}
        onStateChange={handleUpdateTodoState}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}