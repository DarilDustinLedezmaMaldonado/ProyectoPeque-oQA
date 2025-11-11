import { useState, useEffect } from 'react';
import { supabase, Todo } from '../lib/supabase';
import { validateTodoTitle, sanitizeTodoTitle } from '../utils/validation';
import { Plus, Trash2, Check, X, Loader2 } from 'lucide-react';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTodo, setAddingTodo] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedTitle = sanitizeTodoTitle(newTodoTitle);
    const validation = validateTodoTitle(sanitizedTitle);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    try {
      setAddingTodo(true);
      setError(null);
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: sanitizedTitle, completed: false }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTodos([data, ...todos]);
        setNewTodoTitle('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setAddingTodo(false);
    }
  };

  const toggleTodo = async (id: string, currentCompleted: boolean) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('todos')
        .update({ completed: !currentCompleted })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !currentCompleted } : todo
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          <p className="text-slate-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Todo List</h1>
            <div className="flex gap-4 text-sm text-slate-200">
              <span>Total: {stats.total}</span>
              <span>Pending: {stats.pending}</span>
              <span>Completed: {stats.completed}</span>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={addTodo} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Add a new todo..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  disabled={addingTodo}
                />
                <button
                  type="submit"
                  disabled={addingTodo}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addingTodo ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {todos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">No todos yet. Add one to get started!</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="group flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-slate-700 border-slate-700'
                          : 'border-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <span
                      className={`flex-1 transition-all ${
                        todo.completed
                          ? 'text-slate-400 line-through'
                          : 'text-slate-700'
                      }`}
                    >
                      {todo.title}
                    </span>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
