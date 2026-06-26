import type { TodoItem } from "../types/todo";

function createId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function createTodoFromCurrentTab(order: number): Promise<TodoItem | null> {
  const now = new Date().toISOString();

  if (typeof chrome !== "undefined" && chrome.tabs?.query) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab) return null;

    return {
      id: createId(),
      title: tab.title ?? "無題のタブ",
      url: tab.url,
      status: "next",
      order,
      priority: "none",
      createdAt: now,
      updatedAt: now
    };
  }

  return {
    id: createId(),
    title: document.title || "開発中のタブ",
    url: window.location.href,
    status: "next",
    order,
    priority: "none",
    createdAt: now,
    updatedAt: now
  };
}
