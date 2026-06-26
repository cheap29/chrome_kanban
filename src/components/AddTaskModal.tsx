import { FormEvent, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import type { TodoItem, TodoPriority } from "../types/todo";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (input: { title: string; memo?: string; dueLabel?: string; priority: TodoPriority }) => void;
  onAddCurrentTab: () => void;
};

export default function AddTaskModal({ isOpen, onClose, onAddTask, onAddCurrentTab }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [dueLabel, setDueLabel] = useState("");
  const [priority, setPriority] = useState<TodoItem["priority"]>("none");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask({
      title: trimmedTitle,
      memo: memo.trim() || undefined,
      dueLabel: dueLabel.trim() || undefined,
      priority
    });
    setTitle("");
    setMemo("");
    setDueLabel("");
    setPriority("none");
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
          <h2 id="add-task-title">タスクを追加</h2>
          <button className="icon-button" type="button" aria-label="閉じる" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="quick-actions" aria-label="追加方法">
          <button type="button" onClick={() => titleRef.current?.focus()}>
            <Plus size={18} aria-hidden="true" />
            <span>新しいタスク</span>
          </button>
          <button type="button" onClick={onAddCurrentTab}>
            <Plus size={18} aria-hidden="true" />
            <span>今のタブをタスクにする</span>
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
              <span>ラベル</span>
              <input value={dueLabel} onChange={(event) => setDueLabel(event.target.value)} placeholder="今日中" />
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
              追加
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
