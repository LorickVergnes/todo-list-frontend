import './style.css';
import { createTodo, deleteTodo, getTodos, updateTodo, type Todo } from './api.ts';

const form = document.querySelector<HTMLFormElement>('#todo-form')!;
const input = document.querySelector<HTMLInputElement>('#todo-input')!;
const list = document.querySelector<HTMLUListElement>('#todo-list')!;
const counter = document.querySelector<HTMLParagraphElement>('#counter')!;
const errorBox = document.querySelector<HTMLParagraphElement>('#error')!;

let todos: Todo[] = [];

function showError(error: unknown): void {
  errorBox.textContent = error instanceof Error ? error.message : 'Une erreur est survenue.';
  errorBox.hidden = false;
}

function clearError(): void {
  errorBox.hidden = true;
}

// Exécute une action sur l'API puis rafraîchit l'affichage, en signalant les erreurs
async function run(action: () => Promise<void>): Promise<void> {
  try {
    clearError();
    await action();
  } catch (error) {
    showError(error);
  }
  render();
}

function createTodoElement(todo: Todo): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'todo-item';
  item.classList.toggle('completed', todo.completed);

  const label = document.createElement('label');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () =>
    run(async () => {
      const updated = await updateTodo(todo.id, { completed: checkbox.checked });
      todos = todos.map((t) => (t.id === updated.id ? updated : t));
    }),
  );

  const title = document.createElement('span');
  title.textContent = todo.title;

  label.append(checkbox, title);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'delete';
  removeButton.textContent = '✕';
  removeButton.setAttribute('aria-label', `Supprimer « ${todo.title} »`);
  removeButton.addEventListener('click', () =>
    run(async () => {
      await deleteTodo(todo.id);
      todos = todos.filter((t) => t.id !== todo.id);
    }),
  );

  item.append(label, removeButton);
  return item;
}

function render(): void {
  list.replaceChildren(...todos.map(createTodoElement));

  const remaining = todos.filter((t) => !t.completed).length;
  counter.textContent =
    todos.length === 0
      ? 'Aucune tâche pour le moment.'
      : `${remaining} tâche${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''} sur ${todos.length}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  run(async () => {
    const created = await createTodo(title);
    todos = [created, ...todos];
    input.value = '';
  });
});

run(async () => {
  todos = await getTodos();
});
