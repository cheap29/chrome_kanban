import type { TodoItem } from "../types/todo";

const STORAGE_KEY = "imakoko-board.todos";

function hasChromeStorage(): boolean {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

export async function loadTodos(): Promise<TodoItem[]> {
  if (hasChromeStorage()) {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] ?? [];
  }

  const rawValue = localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return [];

  try {
    return JSON.parse(rawValue) as TodoItem[];
  } catch {
    return [];
  }
}

export async function saveTodos(todos: TodoItem[]): Promise<void> {
  if (hasChromeStorage()) {
    await chrome.storage.local.set({
      [STORAGE_KEY]: todos
    });
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
