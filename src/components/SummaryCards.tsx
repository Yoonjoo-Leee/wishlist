import type { StatusCounts } from "../lib/wishItems";

interface Props {
  counts: StatusCounts;
}

const CARDS: { key: keyof StatusCounts; label: string; tone: string }[] = [
  { key: "deliberating", label: "숙려 중", tone: "deliberating" },
  { key: "decided", label: "구매 결정", tone: "decided" },
  { key: "abandoned", label: "구매 포기", tone: "abandoned" },
];

export default function SummaryCards({ counts }: Props) {
  return (
    <section className="summary" aria-label="현황 요약">
      {CARDS.map((c) => (
        <div key={c.key} className={`summary-card summary-card--${c.tone}`}>
          <span className="summary-card__count">{counts[c.key]}</span>
          <span className="summary-card__label">{c.label}</span>
        </div>
      ))}
    </section>
  );
}
