import { useState } from 'react';
import { Todo } from '../services/TodoService';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'creationDate'>) => Promise<void>;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    await onSubmit({
      description,
      category: category || undefined
    });

    setDescription('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
  );
};