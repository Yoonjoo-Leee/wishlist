import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import WishItemCard from "../components/WishItemCard";
import { useWishItems } from "../lib/store";
import {
  countByStatus,
  deliberationEndsAt,
  isDecisionDue,
  itemsByStatus,
} from "../lib/wishItems";
import type { WishStatus } from "../types";

const LIST_LABEL: Record<WishStatus, { title: string; empty: string }> = {
  deliberating: {
    title: "숙려 중인 위시템",
    empty: "숙려 중인 위시템이 없어요.",
  },
  decided: {
    title: "구매 승인한 위시템",
    empty: "아직 구매 승인한 위시템이 없어요.",
  },
  abandoned: {
    title: "관계 종료한 위시템",
    empty: "아직 관계 종료한 위시템이 없어요.",
  },
};

export default function Home() {
  const { items } = useWishItems();
  const [filter, setFilter] = useState<WishStatus>("deliberating");

  const counts = useMemo(() => countByStatus(items), [items]);

  const listItems = useMemo(() => {
    const arr = itemsByStatus(items, filter);
    if (filter === "deliberating") {
      // 결정 대기(숙려 종료)를 위로, 그다음 종료 임박 순
      return arr.sort((a, b) => {
        const aDue = isDecisionDue(a) ? 0 : 1;
        const bDue = isDecisionDue(b) ? 0 : 1;
        if (aDue !== bDue) return aDue - bDue;
        return deliberationEndsAt(a).getTime() - deliberationEndsAt(b).getTime();
      });
    }
    // 구매 승인 / 관계 종료: 최근 결정 순
    return arr.sort((a, b) => {
      const at = a.decidedAt ? new Date(a.decidedAt).getTime() : 0;
      const bt = b.decidedAt ? new Date(b.decidedAt).getTime() : 0;
      return bt - at;
    });
  }, [items, filter]);

  const dueCount = useMemo(
    () =>
      itemsByStatus(items, "deliberating").filter((it) => isDecisionDue(it))
        .length,
    [items],
  );

  const label = LIST_LABEL[filter];

  return (
    <div className="page">
      <SummaryCards counts={counts} active={filter} onSelect={setFilter} />

      {dueCount > 0 && (
        <Link to="/decision" className="decision-banner">
          <span>
            결정할 위시템이 <strong>{dueCount}건</strong> 있어요
          </span>
          <span aria-hidden>→</span>
        </Link>
      )}

      <section className="list-section">
        <div className="list-section__head">
          <h2 className="list-section__title">{label.title}</h2>
          <span className="list-section__count">{listItems.length}건</span>
        </div>

        {listItems.length === 0 ? (
          <p className="empty">{label.empty}</p>
        ) : (
          <div className="wish-list">
            {listItems.map((item) => (
              <WishItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
