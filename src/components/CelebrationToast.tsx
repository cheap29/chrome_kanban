import { Sparkles } from "lucide-react";
import BunnyMascot from "./BunnyMascot";

type CelebrationToastProps = {
  visible: boolean;
  fading: boolean;
  message: string;
};

export default function CelebrationToast({ visible, fading, message }: CelebrationToastProps) {
  if (!visible) return null;

  return (
    <div className={`celebration-toast ${fading ? "fade-out" : ""}`} role="status" aria-live="polite">
      <div className="confetti" aria-hidden="true">
        <Sparkles size={24} strokeWidth={2.2} />
      </div>
      <BunnyMascot size={70} variant="image" />
      <div>
        <p className="toast-title">{message}</p>
        <p className="toast-subtitle">ひとつ進みました</p>
      </div>
    </div>
  );
}
