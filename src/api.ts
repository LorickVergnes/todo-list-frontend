export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

const BASE_URL = '/api/todos';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Erreur ${response.status}`);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export const getTodos = () => request<Todo[]>(BASE_URL);

export const createTodo = (title: string) =>
  request<Todo>(BASE_URL, { method: 'POST', body: JSON.stringify({ title }) });

export const updateTodo = (id: number, changes: Partial<Pick<Todo, 'title' | 'completed'>>) =>
  request<Todo>(`${BASE_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });

export const deleteTodo = (id: number) => request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' });
