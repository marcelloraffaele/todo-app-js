import { useState, useEffect } from 'react'
import './App.css'
import { TodoService, Todo } from './services/TodoService'

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('');
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

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoDescription.trim()) return;

    try {
      const newTodo = await todoService.createTodo({
        description: newTodoDescription,
        category: newTodoCategory || undefined
      });
      setTodos([...todos, newTodo]);
      setNewTodoDescription('');
      setNewTodoCategory('');
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
      <h1 className="text-3xl font-bold text-center mb-8">Todo App</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            value={newTodoCategory}
            onChange={(e) => setNewTodoCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-32 p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {todos.map(todo => (
            <div 
              key={todo.id}
              className="border rounded p-4 flex items-center justify-between"
            >
              <div>
                <p className={`text-lg ${todo.state === 'done' ? 'line-through text-gray-500' : ''}`}>
                  {todo.description}
                </p>
                {todo.category && (
                  <span className="text-sm text-gray-500">
                    Category: {todo.category}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={todo.state || 'active'}
                  onChange={(e) => handleUpdateTodoState(todo.id!, e.target.value as 'done' | 'active' | 'canceled')}
                  className="border rounded p-1"
                >
                  <option value="active">Active</option>
                  <option value="done">Done</option>
                  <option value="canceled">Canceled</option>
                </select>
                <button
                  onClick={() => handleDeleteTodo(todo.id!)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
