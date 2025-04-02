import { Todo } from '../services/TodoService';

interface TodoItemProps {
  todo: Todo;
  onStateChange: (id: number, state: 'done' | 'active' | 'canceled') => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItem = ({ todo, onStateChange, onDelete }: TodoItemProps) => {
  return (
    <div className="border rounded p-4 flex items-center justify-between">
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
          onChange={(e) => onStateChange(todo.id!, e.target.value as 'done' | 'active' | 'canceled')}
          className="border rounded p-1"
        >
          <option value="active">Active</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
        <button
          onClick={() => onDelete(todo.id!)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};