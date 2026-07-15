import { PRESS_TYPE_LABELS, type PressType } from "../../../lib/press";

export default function PressBadge({ type }: { type: PressType }) {
  return <span className={`press-badge press-badge--${type}`}>{PRESS_TYPE_LABELS[type]}</span>;
}
