import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ArrowDown, ArrowUp, Check, GripVertical, Trash2 } from "lucide-react";
import type { TodoItem, TodoStatus } from "../types/todo";

type TodoCardProps = {
  todo: TodoItem;
  canMoveDown: boolean;
  canMoveUp: boolean;
  onComplete: (todoId: string) => void;
  onDeleteRequest: (todoId: string) => void;
  onMoveByMenu: (todoId: string, status: TodoStatus) => void;
  onReorderByButton: (todoId: string, direction: "up" | "down") => void;
};

export default function TodoCard({
  todo,
  canMoveDown,
  canMoveUp,
  onComplete,
  onDeleteRequest,
  onMoveByMenu,
  onReorderByButton
}: TodoCardProps) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    data: {
      type: "todo",
      status: todo.status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article ref={setNodeRef} style={style} className={`todo-card ${isDragging ? "is-dragging" : ""}`}>
      <button className="complete-button" type="button" aria-label={`${todo.title}を完了にする`} onClick={() => onComplete(todo.id)}>
        <Check size={14} strokeWidth={3} aria-hidden="true" />
      </button>

      <div className="todo-content">
        <a className="todo-title" href={todo.url} target="_blank" rel="noreferrer" onClick={(event) => !todo.url && event.preventDefault()}>
          {todo.title}
        </a>
        {todo.memo && <p className="todo-memo">{todo.memo}</p>}
        <div className="todo-labels" aria-label="タスクラベル">
          {todo.dueLabel && <span>{todo.dueLabel}</span>}
          {todo.priority === "important" && <span className="important-label">重要</span>}
          {todo.url && <span>タブ</span>}
        </div>
      </div>

      <div className="card-actions">
        <select
          aria-label={`${todo.title}の移動先`}
          value={todo.status}
          onChange={(event) => onMoveByMenu(todo.id, event.target.value as TodoStatus)}
        >
          <option value="main">メイン</option>
          <option value="next">次やる</option>
          <option value="pending">今は考えない</option>
        </select>
        <div className="order-buttons" aria-label={`${todo.title}の順番変更`}>
          <button type="button" aria-label={`${todo.title}を上へ移動`} disabled={!canMoveUp} onClick={() => onReorderByButton(todo.id, "up")}>
            <ArrowUp size={16} strokeWidth={2.4} aria-hidden="true" />
          </button>
          <button type="button" aria-label={`${todo.title}を下へ移動`} disabled={!canMoveDown} onClick={() => onReorderByButton(todo.id, "down")}>
            <ArrowDown size={16} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
        <button className="delete-button" type="button" aria-label={`${todo.title}を削除`} onClick={() => onDeleteRequest(todo.id)}>
          <Trash2 size={17} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <button
          ref={setActivatorNodeRef}
          className="drag-handle"
          type="button"
          aria-label={`${todo.title}をドラッグ`}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
