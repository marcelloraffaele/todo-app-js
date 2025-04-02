import { Todo } from '../services/TodoService';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onStateChange: (id: number, state: 'done' | 'active' | 'canceled') => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export const TodoList = ({ todos, onStateChange, onDelete, loading }: TodoListProps) => {
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStateChange={onStateChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};