import type { WishStatus } from "../types";
import type { StatusCounts } from "../lib/wishItems";

interface Props {
  counts: StatusCounts;
  active: WishStatus;
  onSelect: (status: WishStatus) => void;
}

const CARDS: { key: WishStatus; label: string; tone: string }[] = [
  { key: "deliberating", label: "숙려 중", tone: "deliberating" },
  { key: "decided", label: "구매 승인", tone: "decided" },
  { key: "abandoned", label: "관계 종료", tone: "abandoned" },
];

export default function SummaryCards({ counts, active, onSelect }: Props) {
  return (
    <section className="summary" aria-label="현황 요약 · 목록 필터">
      {CARDS.map((c) => (
        <button
          type="button"
          key={c.key}
          className={`summary-card summary-card--${c.tone} ${
            active === c.key ? "summary-card--active" : ""
          }`}
          aria-pressed={active === c.key}
          onClick={() => onSelect(c.key)}
        >
          <span className="summary-card__count">{counts[c.key]}</span>
          <span className="summary-card__label">{c.label}</span>
        </button>
      ))}
    </section>
  );
}
