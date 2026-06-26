import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ListTodo, Moon, Target } from "lucide-react";
import TodoCard from "./TodoCard";
import type { TodoItem, TodoStatus } from "../types/todo";
import { laneLabels } from "../types/todo";

type TodoLaneProps = {
  status: Exclude<TodoStatus, "done">;
  todos: TodoItem[];
  onComplete: (todoId: string) => void;
  onDeleteRequest: (todoId: string) => void;
  onMoveByMenu: (todoId: string, status: TodoStatus) => void;
  onReorderByButton: (todoId: string, direction: "up" | "down") => void;
};

export default function TodoLane({ status, todos, onComplete, onDeleteRequest, onMoveByMenu, onReorderByButton }: TodoLaneProps) {
  const label = laneLabels[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const LaneIcon = status === "main" ? Target : status === "next" ? ListTodo : Moon;

  return (
    <section ref={setNodeRef} className={`todo-lane lane-${status} ${isOver ? "is-over" : ""}`} aria-labelledby={`${status}-heading`}>
      <div className="lane-header">
        <div>
          <h2 id={`${status}-heading`}>
            <LaneIcon className="lane-icon" size={18} strokeWidth={2.4} aria-hidden="true" />
            {label.title}
          </h2>
          <p>{label.subtitle}</p>
        </div>
        <span className="lane-count" aria-label={`${label.title}の件数`}>
          {todos.length}
        </span>
      </div>

      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        <div className="lane-list">
          {todos.map((todo, index) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              canMoveUp={index > 0}
              canMoveDown={index < todos.length - 1}
              onComplete={onComplete}
              onDeleteRequest={onDeleteRequest}
              onMoveByMenu={onMoveByMenu}
              onReorderByButton={onReorderByButton}
            />
          ))}
          {todos.length === 0 && <p className="empty-lane">ここは空です</p>}
        </div>
      </SortableContext>
    </section>
  );
}
