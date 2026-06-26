export type TodoStatus = "main" | "next" | "pending" | "done";

export type TodoPriority = "none" | "important";

export type TodoItem = {
  id: string;
  title: string;
  memo?: string;
  url?: string;
  status: TodoStatus;
  order: number;
  priority: TodoPriority;
  dueLabel?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export const activeStatuses: Exclude<TodoStatus, "done">[] = ["main", "next", "pending"];

export const laneLabels: Record<Exclude<TodoStatus, "done">, { title: string; subtitle: string }> = {
  main: {
    title: "メイン",
    subtitle: "今やること"
  },
  next: {
    title: "次やる",
    subtitle: "次に着手する候補"
  },
  pending: {
    title: "今は考えない",
    subtitle: "今は考えなくてOK"
  }
};
