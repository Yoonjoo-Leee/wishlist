import { useMemo } from "react";
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

export default function Home() {
  const { items } = useWishItems();

  const counts = useMemo(() => countByStatus(items), [items]);

  const deliberating = useMemo(() => {
    return itemsByStatus(items, "deliberating").sort((a, b) => {
      // 결정 대기(숙려 종료)를 위로, 그다음 종료 임박 순
      const aDue = isDecisionDue(a) ? 0 : 1;
      const bDue = isDecisionDue(b) ? 0 : 1;
      if (aDue !== bDue) return aDue - bDue;
      return deliberationEndsAt(a).getTime() - deliberationEndsAt(b).getTime();
    });
  }, [items]);

  const dueCount = useMemo(
    () => deliberating.filter((it) => isDecisionDue(it)).length,
    [deliberating],
  );

  return (
    <div className="page">
      <SummaryCards counts={counts} />

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
          <h2 className="list-section__title">숙려 중인 위시템</h2>
          <span className="list-section__count">{deliberating.length}건</span>
        </div>

        {deliberating.length === 0 ? (
          <p className="empty">숙려 중인 위시템이 없어요.</p>
        ) : (
          <div className="wish-list">
            {deliberating.map((item) => (
              <WishItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
