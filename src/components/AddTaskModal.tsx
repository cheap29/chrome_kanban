import { FormEvent, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { TodoItem, TodoPriority } from "../types/todo";

type TaskFormInput = {
  title: string;
  memo?: string;
  dueDate?: string;
  priority: TodoPriority;
};

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (input: TaskFormInput) => void;
  editingTodo?: TodoItem | null;
};

export default function AddTaskModal({ isOpen, onClose, onSaveTask, editingTodo }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TodoItem["priority"]>("none");
  const titleRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(editingTodo);

  useEffect(() => {
    if (isOpen) {
      setTitle(editingTodo?.title ?? "");
      setMemo(editingTodo?.memo ?? "");
      setDueDate(editingTodo?.dueDate ?? "");
      setPriority(editingTodo?.priority ?? "none");
      window.setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [editingTodo, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSaveTask({
      title: trimmedTitle,
      memo: memo.trim() || undefined,
      dueDate: dueDate || undefined,
      priority
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="add-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="add-task-title">{isEditing ? "タスクを編集" : "タスクを追加"}</h2>
          <button className="icon-button" type="button" aria-label="閉じる" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            <span>タスク名</span>
            <input ref={titleRef} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例: 確認メールを送る" />
          </label>

          <label>
            <span>メモ</span>
            <textarea value={memo} onChange={(event) => setMemo(event.target.value)} rows={3} placeholder="必要なら少しだけメモ" />
          </label>

          <div className="form-row">
            <label>
              <span>予定日</span>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            </label>

            <label>
              <span>重要</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value as TodoPriority)}>
                <option value="none">なし</option>
                <option value="important">重要</option>
              </select>
            </label>
          </div>

          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              キャンセル
            </button>
            <button className="primary-button" type="submit">
              {isEditing ? "保存" : "追加"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
