import { useEffect, useMemo, useRef, useState } from "react";
import AddTaskModal from "../components/AddTaskModal";
import CelebrationToast from "../components/CelebrationToast";
import FloatingAddButton from "../components/FloatingAddButton";
import Header from "../components/Header";
import TimeCalendarBar from "../components/TimeCalendarBar";
import TodoBoard from "../components/TodoBoard";
import celebrationMessages from "../data/celebrationMessages.json";
import { loadTodos, saveTodos } from "../lib/storage";
import type { TodoItem, TodoPriority, TodoStatus } from "../types/todo";
import { todayDateInputValue, tomorrowDateInputValue } from "../utils/dueDate";
import { moveTodo, nextOrderFor, normalizeTodoOrders } from "../utils/reorderTodos";

const MAIN_LIMIT = 3;
const MAIN_LIMIT_MESSAGE = "メインは3つまで。どれかを「次やる」か「今は考えない」に移動してね。";

function createId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createInitialTodos(): TodoItem[] {
  const now = new Date().toISOString();

  return [
    {
      id: createId(),
      title: "プレゼン資料を仕上げる",
      status: "main",
      order: 0,
      priority: "important",
      dueDate: todayDateInputValue(),
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      title: "クライアントに確認メールを送る",
      status: "main",
      order: 1,
      priority: "none",
      dueDate: todayDateInputValue(),
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      title: "企画書の構成を考える",
      status: "next",
      order: 0,
      priority: "none",
      dueDate: tomorrowDateInputValue(),
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      title: "経費精算をする",
      status: "next",
      order: 1,
      priority: "none",
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      title: "本を読む",
      status: "pending",
      order: 0,
      priority: "none",
      dueLabel: "いつか",
      createdAt: now,
      updatedAt: now
    }
  ];
}

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastFading, setToastFading] = useState(false);
  const [toastMessage, setToastMessage] = useState(celebrationMessages[0] ?? "おめでと！");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const toastTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    loadTodos().then((storedTodos) => {
      const nextTodos = storedTodos.length > 0 ? normalizeTodoOrders(storedTodos) : createInitialTodos();
      initializedRef.current = true;
      setTodos(nextTodos);
      setIsLoading(false);
      if (storedTodos.length === 0) {
        void saveTodos(nextTodos);
      }
    });
  }, []);

  useEffect(() => {
    if (!initializedRef.current || isLoading) return;
    void saveTodos(todos);
  }, [todos, isLoading]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    };
  }, []);

  const activeTodos = useMemo(() => todos.filter((todo) => todo.status !== "done"), [todos]);
  const deleteTargetTodo = useMemo(() => todos.find((todo) => todo.id === deleteTargetId), [deleteTargetId, todos]);
  const editingTodo = useMemo(() => todos.find((todo) => todo.id === editingTodoId) ?? null, [editingTodoId, todos]);

  function showError(message: string) {
    setErrorMessage(message);
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => setErrorMessage(""), 4200);
  }

  function randomCelebrationMessage(): string {
    const index = Math.floor(Math.random() * celebrationMessages.length);
    return celebrationMessages[index] ?? "おめでと！";
  }

  function showCelebrationToast() {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);

    setToastMessage(randomCelebrationMessage());
    setToastFading(false);
    setToastVisible(true);

    toastTimerRef.current = window.setTimeout(() => {
      setToastFading(true);
      fadeTimerRef.current = window.setTimeout(() => setToastVisible(false), 420);
    }, 5000);
  }

  function canMoveToStatus(todoId: string, status: TodoStatus): boolean {
    const todo = todos.find((item) => item.id === todoId);
    if (!todo) return false;
    if (status !== "main" || todo.status === "main") return true;
    return todos.filter((item) => item.status === "main").length < MAIN_LIMIT;
  }

  function handleDropTodo(activeId: string, targetStatus: TodoStatus, overId?: string) {
    if (!canMoveToStatus(activeId, targetStatus)) {
      showError(MAIN_LIMIT_MESSAGE);
      return;
    }

    setTodos((currentTodos) => moveTodo(currentTodos, activeId, targetStatus, overId));
  }

  function handleMoveByMenu(todoId: string, status: TodoStatus) {
    if (!canMoveToStatus(todoId, status)) {
      showError(MAIN_LIMIT_MESSAGE);
      return;
    }

    setTodos((currentTodos) => moveTodo(currentTodos, todoId, status));
  }

  function handleReorderByButton(todoId: string, direction: "up" | "down") {
    setTodos((currentTodos) => {
      const todo = currentTodos.find((item) => item.id === todoId);
      if (!todo) return currentTodos;

      const laneTodos = currentTodos.filter((item) => item.status === todo.status).sort((a, b) => a.order - b.order);
      const currentIndex = laneTodos.findIndex((item) => item.id === todoId);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const targetTodo = laneTodos[targetIndex];

      if (!targetTodo) return currentTodos;
      return moveTodo(currentTodos, todoId, todo.status, targetTodo.id);
    });
  }

  function handleComplete(todoId: string) {
    const now = new Date().toISOString();
    setTodos((currentTodos) =>
      normalizeTodoOrders(
        currentTodos.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                status: "done",
                completedAt: now,
                updatedAt: now
              }
            : todo
        )
      )
    );
    showCelebrationToast();
  }

  function handleDeleteRequest(todoId: string) {
    setDeleteTargetId(todoId);
  }

  function handleEditRequest(todoId: string) {
    setEditingTodoId(todoId);
    setIsModalOpen(true);
  }

  function handleOpenAddTask() {
    setEditingTodoId(null);
    setIsModalOpen(true);
  }

  function handleCloseTaskModal() {
    setIsModalOpen(false);
    setEditingTodoId(null);
  }

  function handleCancelDelete() {
    setDeleteTargetId(null);
  }

  function handleConfirmDelete() {
    if (!deleteTargetId) return;

    setTodos((currentTodos) => normalizeTodoOrders(currentTodos.filter((todo) => todo.id !== deleteTargetId)));
    setDeleteTargetId(null);
  }

  function handleSaveTask(input: { title: string; memo?: string; dueDate?: string; priority: TodoPriority }) {
    const now = new Date().toISOString();

    if (editingTodoId) {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingTodoId
            ? {
                ...todo,
                title: input.title,
                memo: input.memo,
                dueDate: input.dueDate,
                dueLabel: input.dueDate ? undefined : todo.dueLabel,
                priority: input.priority,
                updatedAt: now
              }
            : todo
        )
      );
      handleCloseTaskModal();
      return;
    }

    const newTodo: TodoItem = {
      id: createId(),
      title: input.title,
      memo: input.memo,
      dueDate: input.dueDate,
      status: "next",
      order: nextOrderFor(todos, "next"),
      priority: input.priority,
      createdAt: now,
      updatedAt: now
    };

    setTodos((currentTodos) => normalizeTodoOrders([...currentTodos, newTodo]));
    handleCloseTaskModal();
  }

  if (isLoading) {
    return (
      <div className="app-shell">
        <TimeCalendarBar />
        <Header />
        <p className="loading-message">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TimeCalendarBar />
      <div className="header-with-add">
        <Header />
        <FloatingAddButton onClick={handleOpenAddTask} />
      </div>
      <TodoBoard
        todos={activeTodos}
        onDropTodo={handleDropTodo}
        onComplete={handleComplete}
        onEditRequest={handleEditRequest}
        onDeleteRequest={handleDeleteRequest}
        onMoveByMenu={handleMoveByMenu}
        onReorderByButton={handleReorderByButton}
      />
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseTaskModal}
        onSaveTask={handleSaveTask}
        editingTodo={editingTodo}
      />
      <CelebrationToast visible={toastVisible} fading={toastFading} message={toastMessage} />
      {deleteTargetTodo && (
        <div className="modal-backdrop confirm-backdrop" role="presentation">
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
            <h2 id="delete-confirm-title">このタスクを削除しますか？</h2>
            <p className="confirm-task-title">{deleteTargetTodo.title}</p>
            <p className="confirm-message">削除したタスクは元に戻せません。</p>
            <div className="confirm-actions">
              <button className="secondary-button" type="button" onClick={handleCancelDelete}>
                キャンセル
              </button>
              <button className="danger-button" type="button" onClick={handleConfirmDelete}>
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="error-toast" role="alert">
          {errorMessage}
        </div>
      )}
      <nav className="bottom-menu" aria-label="下部メニュー">
        <span>完了済み {todos.filter((todo) => todo.status === "done").length}</span>
        <span>保存済み</span>
      </nav>
    </div>
  );
}
