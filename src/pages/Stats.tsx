import { useMemo } from "react";
import { useWishItems } from "../lib/store";
import { CATEGORY_SLUG, formatPrice } from "../lib/wishItems";
import {
  amountStats,
  averageDaysToDecision,
  averageDeliberationDays,
  categoryStats,
  resolvedStats,
} from "../lib/stats";

function widthPct(part: number, whole: number): string {
  if (whole <= 0) return "0%";
  return `${(part / whole) * 100}%`;
}

export default function Stats() {
  const { items } = useWishItems();

  const amounts = useMemo(() => amountStats(items), [items]);
  const cats = useMemo(() => categoryStats(items), [items]);
  const avgDays = useMemo(() => averageDeliberationDays(items), [items]);
  const avgToDecision = useMemo(() => averageDaysToDecision(items), [items]);
  const resolved = useMemo(() => resolvedStats(items), [items]);

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="page-head">
          <h2 className="page-head__title">캠프 기록</h2>
        </div>
        <p className="empty">
          아직 데이터가 없어요.
          <br />
          위시템이 입소하면 기록이 쌓여요.
        </p>
      </div>
    );
  }

  const hasResolved = resolved.decided + resolved.abandoned > 0;
  const ratePct = Math.round(resolved.abandonRate * 100);
  const maxCatTotal = Math.max(...cats.map((c) => c.total), 1);

  return (
    <div className="page">
      <div className="page-head">
        <h2 className="page-head__title">캠프 기록</h2>
        <p className="page-head__desc">숙려가 지출에 어떤 영향을 줬는지 봐요.</p>
      </div>

      <section className={`stat-hero ${hasResolved ? "" : "stat-hero--muted"}`}>
        {hasResolved ? (
          <>
            <span className="stat-hero__label">관계 종료율</span>
            <span className="stat-hero__value">{ratePct}%</span>
            <span className="stat-hero__sub">
              숙려로 아낀 금액 <strong>{formatPrice(amounts.abandoned)}</strong>
            </span>
          </>
        ) : (
          <span className="stat-hero__sub">
            아직 결정한 위시템이 없어요. 숙려가 끝나면 여기에 결과가 쌓여요.
          </span>
        )}
      </section>

      <section className="list-section">
        <div className="list-section__head">
          <h3 className="list-section__title">금액 통계</h3>
        </div>
        <div className="stack-bar" aria-hidden>
          <span
            className="stack-bar__seg stack-bar__seg--deliberating"
            style={{ width: widthPct(amounts.deliberating, amounts.total) }}
          />
          <span
            className="stack-bar__seg stack-bar__seg--decided"
            style={{ width: widthPct(amounts.decided, amounts.total) }}
          />
          <span
            className="stack-bar__seg stack-bar__seg--abandoned"
            style={{ width: widthPct(amounts.abandoned, amounts.total) }}
          />
        </div>
        <dl className="detail">
          <div className="detail__row">
            <dt>총 위시금액</dt>
            <dd>{formatPrice(amounts.total)}</dd>
          </div>
          <div className="detail__row">
            <dt>
              <span className="dot dot--deliberating" />
              숙려 중
            </dt>
            <dd>{formatPrice(amounts.deliberating)}</dd>
          </div>
          <div className="detail__row">
            <dt>
              <span className="dot dot--decided" />
              구매 승인
            </dt>
            <dd>{formatPrice(amounts.decided)}</dd>
          </div>
          <div className="detail__row">
            <dt>
              <span className="dot dot--abandoned" />
              관계 종료
            </dt>
            <dd>{formatPrice(amounts.abandoned)}</dd>
          </div>
        </dl>
      </section>

      <section className="list-section">
        <div className="list-section__head">
          <h3 className="list-section__title">평균 숙려일</h3>
        </div>
        <div className="stat-duo">
          <div className="stat-duo__item">
            <span className="stat-duo__value">{avgDays}일</span>
            <span className="stat-duo__label">설정한 숙려 기간</span>
          </div>
          <div className="stat-duo__item">
            <span className="stat-duo__value">
              {avgToDecision > 0 ? `${avgToDecision}일` : "-"}
            </span>
            <span className="stat-duo__label">입소 → 결정 소요</span>
          </div>
        </div>
      </section>

      <section className="list-section">
        <div className="list-section__head">
          <h3 className="list-section__title">카테고리별</h3>
        </div>
        <div className="cat-stats">
          {cats.map((c) => (
            <div className="cat-row" key={c.category}>
              <div className="cat-row__head">
                <span
                  className={`wish-card__category wish-card__category--${
                    CATEGORY_SLUG[c.category] ?? "etc"
                  }`}
                >
                  {c.category}
                </span>
                <span className="cat-row__meta">
                  {c.count}건 · {formatPrice(c.total)}
                </span>
              </div>
              <div className="cat-row__bar">
                <span
                  className={`cat-row__fill cat-fill--${
                    CATEGORY_SLUG[c.category] ?? "etc"
                  }`}
                  style={{ width: `${(c.total / maxCatTotal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
