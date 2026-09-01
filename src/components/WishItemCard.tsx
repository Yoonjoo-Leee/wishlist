import { Link } from "react-router-dom";
import type { WishItem } from "../types";
import {
  CATEGORY_SLUG,
  daysLeft,
  deliberationEndsAt,
  displayHost,
  formatDate,
  formatPrice,
  isDecisionDue,
} from "../lib/wishItems";

interface Props {
  item: WishItem;
}

function formatMonthDay(d: Date): string {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function WishItemCard({ item }: Props) {
  const due = isDecisionDue(item);
  const left = daysLeft(item);
  const endsAt = deliberationEndsAt(item);
  const catSlug = CATEGORY_SLUG[item.category] ?? "etc";

  return (
    <article className="wish-card">
      <Link
        to={`/item/${item.id}`}
        className="wish-card__link"
        aria-label={`${item.name} 상세 보기`}
      />
      <div className="wish-card__top">
        <span className={`wish-card__category wish-card__category--${catSlug}`}>
          {item.category}
        </span>
        {due ? (
          <span className="wish-card__badge wish-card__badge--due">결정 대기</span>
        ) : (
          <span className="wish-card__badge">D-{left}</span>
        )}
      </div>

      <h3 className="wish-card__name">{item.name}</h3>
      <p className="wish-card__price">{formatPrice(item.price)}</p>

      {item.url && (
        <a
          className="wish-card__url"
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {displayHost(item.url)}
          <span aria-hidden> ↗</span>
        </a>
      )}

      <p className="wish-card__reason">{item.reason}</p>

      <div className="wish-card__meta">
        <span>입소 {formatDate(item.createdAt)}</span>
        <span aria-hidden>·</span>
        <span>숙려 종료 {formatMonthDay(endsAt)}</span>
        {item.reDeliberationCount > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>유예 {item.reDeliberationCount}회</span>
          </>
        )}
      </div>
    </article>
  );
}
