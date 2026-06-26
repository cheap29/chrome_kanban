import { Plus } from "lucide-react";

type FloatingAddButtonProps = {
  onClick: () => void;
};

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button className="floating-add-button" type="button" aria-label="タスクを追加" onClick={onClick}>
      <Plus size={30} strokeWidth={2.6} aria-hidden="true" />
    </button>
  );
}
