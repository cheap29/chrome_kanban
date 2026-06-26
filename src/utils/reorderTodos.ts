import { arrayMove } from "@dnd-kit/sortable";
import type { TodoItem, TodoStatus } from "../types/todo";

const statuses: TodoStatus[] = ["main", "next", "pending", "done"];

export function sortTodos(todos: TodoItem[]): TodoItem[] {
  return [...todos].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt));
}

export function nextOrderFor(todos: TodoItem[], status: TodoStatus): number {
  return todos.filter((todo) => todo.status === status).length;
}

export function normalizeTodoOrders(todos: TodoItem[]): TodoItem[] {
  const normalized: TodoItem[] = [];

  for (const status of statuses) {
    sortTodos(todos.filter((todo) => todo.status === status)).forEach((todo, index) => {
      normalized.push({ ...todo, order: index });
    });
  }

  return normalized;
}

export function assignTodoOrders(todos: TodoItem[]): TodoItem[] {
  const orderByStatus = new Map<TodoStatus, number>();

  return todos.map((todo) => {
    const nextOrder = orderByStatus.get(todo.status) ?? 0;
    orderByStatus.set(todo.status, nextOrder + 1);
    return { ...todo, order: nextOrder };
  });
}

export function moveTodo(todos: TodoItem[], activeId: string, targetStatus: TodoStatus, overId?: string): TodoItem[] {
  const activeTodo = todos.find((todo) => todo.id === activeId);
  if (!activeTodo) return todos;
  if (activeId === overId && activeTodo.status === targetStatus) return todos;

  const now = new Date().toISOString();

  if (activeTodo.status === targetStatus && overId) {
    const laneTodos = sortTodos(todos.filter((todo) => todo.status === targetStatus));
    const oldIndex = laneTodos.findIndex((todo) => todo.id === activeId);
    const newIndex = laneTodos.findIndex((todo) => todo.id === overId);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return todos;

    const reorderedLane = arrayMove(laneTodos, oldIndex, newIndex).map((todo) =>
      todo.id === activeId ? { ...todo, updatedAt: now } : todo
    );

    return assignTodoOrders([...todos.filter((todo) => todo.status !== targetStatus), ...reorderedLane]);
  }

  const withoutActive = todos.filter((todo) => todo.id !== activeId);
  const movedTodo: TodoItem = {
    ...activeTodo,
    status: targetStatus,
    updatedAt: now
  };
  const result: TodoItem[] = [];

  for (const status of statuses) {
    const laneTodos = sortTodos(withoutActive.filter((todo) => todo.status === status));

    if (status === targetStatus) {
      const overIndex = overId ? laneTodos.findIndex((todo) => todo.id === overId) : -1;
      const insertIndex = overIndex >= 0 ? overIndex : laneTodos.length;
      const nextLane = [...laneTodos];
      nextLane.splice(insertIndex, 0, movedTodo);
      result.push(...nextLane);
    } else {
      result.push(...laneTodos);
    }
  }

  return assignTodoOrders(result);
}
