import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TodoLane from "./TodoLane";
import type { TodoItem, TodoStatus } from "../types/todo";
import { activeStatuses } from "../types/todo";
import { sortTodos } from "../utils/reorderTodos";

type ActiveStatus = (typeof activeStatuses)[number];

type TodoBoardProps = {
  todos: TodoItem[];
  onDropTodo: (activeId: string, targetStatus: TodoStatus, overId?: string) => void;
  onComplete: (todoId: string) => void;
  onEditRequest: (todoId: string) => void;
  onDeleteRequest: (todoId: string) => void;
  onMoveByMenu: (todoId: string, status: TodoStatus) => void;
  onReorderByButton: (todoId: string, direction: "up" | "down") => void;
};

export default function TodoBoard({ todos, onDropTodo, onComplete, onEditRequest, onDeleteRequest, onMoveByMenu, onReorderByButton }: TodoBoardProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : undefined;
    if (!overId) return;

    const overTodo = todos.find((todo) => todo.id === overId);
    const isLaneDrop = activeStatuses.includes(overId as ActiveStatus);
    const targetStatus = isLaneDrop ? (overId as ActiveStatus) : overTodo?.status;

    if (!targetStatus) return;
    onDropTodo(activeId, targetStatus, overTodo?.id);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <main className="board" aria-label="今ここボード">
        {activeStatuses.map((status) => (
          <TodoLane
            key={status}
            status={status}
            todos={sortTodos(todos.filter((todo) => todo.status === status))}
            onComplete={onComplete}
            onEditRequest={onEditRequest}
            onDeleteRequest={onDeleteRequest}
            onMoveByMenu={onMoveByMenu}
            onReorderByButton={onReorderByButton}
          />
        ))}
      </main>
    </DndContext>
  );
}
