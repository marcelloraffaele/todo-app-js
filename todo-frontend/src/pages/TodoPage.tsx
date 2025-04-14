import { useState, useEffect } from 'react'
import { TodoService, Todo } from '../services/TodoService'
import { ErrorMessage } from '../components/ErrorMessage'
import { TodoForm } from '../components/TodoForm'
import { TodoList } from '../components/TodoList'

export const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todoService = new TodoService();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await todoService.getAllTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (newTodo: Omit<Todo, 'id' | 'creationDate'>) => {
    try {
      const todo = await todoService.createTodo(newTodo);
      setTodos([...todos, todo]);
      setError(null);
    } catch (err) {
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
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
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