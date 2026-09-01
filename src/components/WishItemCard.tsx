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

function badgeFor(item: WishItem): { text: string; cls: string } {
  if (item.status === "decided")
    return { text: "구매 승인", cls: "wish-card__badge--decided" };
  if (item.status === "abandoned")
    return { text: "관계 종료", cls: "wish-card__badge--abandoned" };
  if (isDecisionDue(item))
    return { text: "결정 대기", cls: "wish-card__badge--due" };
  return { text: `D-${daysLeft(item)}`, cls: "" };
}

export default function WishItemCard({ item }: Props) {
  const catSlug = CATEGORY_SLUG[item.category] ?? "etc";
  const badge = badgeFor(item);

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
        <span className={`wish-card__badge ${badge.cls}`}>{badge.text}</span>
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

        {item.status === "deliberating" && (
          <>
            <span aria-hidden>·</span>
            <span>숙려 종료 {formatMonthDay(deliberationEndsAt(item))}</span>
          </>
        )}

        {item.status !== "deliberating" && item.decidedAt && (
          <>
            <span aria-hidden>·</span>
            <span>
              {item.status === "decided" ? "승인" : "종료"}{" "}
              {formatDate(item.decidedAt)}
            </span>
          </>
        )}

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
