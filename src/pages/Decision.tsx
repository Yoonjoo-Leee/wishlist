import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { WishItem } from "../types";
import { useWishItems, reDeliberateItem, resolveItem } from "../lib/store";
import {
  CATEGORY_SLUG,
  canReDeliberate,
  daysOverdue,
  deliberationEndsAt,
  displayHost,
  dueItems,
  formatDate,
  formatPrice,
} from "../lib/wishItems";

const DELIBERATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

function monthDay(d: Date): string {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

type Mode = "decided" | "abandoned" | "redeliberate" | null;

function DecisionCard({ item }: { item: WishItem }) {
  const [mode, setMode] = useState<Mode>(null);
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(3);
  const [error, setError] = useState("");

  const catSlug = CATEGORY_SLUG[item.category] ?? "etc";
  const overdue = daysOverdue(item);
  const canRedo = canReDeliberate(item);

  function reset() {
    setMode(null);
    setReason("");
    setDays(3);
    setError("");
  }

  function confirmResolve(status: "decided" | "abandoned") {
    if (!reason.trim()) {
      setError("결정 이유를 적어 주세요.");
      return;
    }
    resolveItem(item.id, status, reason);
    // 확정되면 목록에서 사라진다 (상태가 deliberating이 아니게 됨)
  }

  function confirmRedeliberate() {
    reDeliberateItem(item.id, days);
  }

  return (
    <article className="decision-card">
      <div className="decision-card__top">
        <span className={`wish-card__category wish-card__category--${catSlug}`}>
          {item.category}
        </span>
        <span className="decision-card__due">
          숙려 종료 {monthDay(deliberationEndsAt(item))}
          {overdue > 0 && ` · ${overdue}일 지남`}
        </span>
      </div>

      <h3 className="decision-card__name">{item.name}</h3>
      <p className="decision-card__price">{formatPrice(item.price)}</p>
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

      <dl className="detail">
        <div className="detail__row">
          <dt>입소일</dt>
          <dd>{formatDate(item.createdAt)}</dd>
        </div>
        <div className="detail__row">
          <dt>숙려 기간</dt>
          <dd>{item.deliberationDays}일</dd>
        </div>
        <div className="detail__row">
          <dt>유예</dt>
          <dd>{item.reDeliberationCount}회</dd>
        </div>
      </dl>

      <div className="detail__reason">
        <span className="detail__reason-label">입소 사유</span>
        <p>{item.reason}</p>
      </div>

      {mode === null && (
        <div className="decision-actions">
          <button
            className="dbtn dbtn--decide"
            onClick={() => setMode("decided")}
          >
            구매 승인
          </button>
          <button
            className="dbtn dbtn--redo"
            onClick={() => setMode("redeliberate")}
            disabled={!canRedo}
            title={canRedo ? undefined : "유예는 2회까지 가능해요"}
          >
            유예
          </button>
          <button
            className="dbtn dbtn--abandon"
            onClick={() => setMode("abandoned")}
          >
            관계 종료
          </button>
        </div>
      )}

      {!canRedo && mode === null && (
        <p className="decision-hint">유예는 2회까지 가능해요. 이번에 결정해요.</p>
      )}

      {(mode === "decided" || mode === "abandoned") && (
        <div className="decision-form">
          <span className="field__label">
            {mode === "decided" ? "구매를 승인한 이유" : "관계를 종료한 이유"}
          </span>
          <textarea
            className="field__input field__textarea"
            rows={3}
            autoFocus
            placeholder="숙려 기간을 거친 지금의 판단을 남겨 두세요."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <span className="field__error">{error}</span>}
          <div className="decision-form__buttons">
            <button className="btn-ghost" onClick={reset}>
              취소
            </button>
            <button
              className={
                mode === "decided" ? "btn-primary" : "btn-primary btn-primary--danger"
              }
              onClick={() => confirmResolve(mode)}
            >
              {mode === "decided" ? "구매 승인 확정" : "관계 종료 확정"}
            </button>
          </div>
        </div>
      )}

      {mode === "redeliberate" && (
        <div className="decision-form">
          <span className="field__label">유예 기간</span>
          <div className="segmented">
            {DELIBERATION_OPTIONS.map((d) => (
              <button
                type="button"
                key={d}
                className={`segmented__item ${
                  days === d ? "segmented__item--on" : ""
                }`}
                onClick={() => setDays(d)}
              >
                {d}일
              </button>
            ))}
          </div>
          <p className="decision-hint">
            유예 후 횟수는 {item.reDeliberationCount + 1}회가 돼요.
          </p>
          <div className="decision-form__buttons">
            <button className="btn-ghost" onClick={reset}>
              취소
            </button>
            <button className="btn-primary" onClick={confirmRedeliberate}>
              {days}일 더 숙려하기
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Decision() {
  const { items } = useWishItems();
  const due = useMemo(
    () =>
      dueItems(items).sort(
        (a, b) =>
          deliberationEndsAt(a).getTime() - deliberationEndsAt(b).getTime(),
      ),
    [items],
  );

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/" className="back-link">← 홈</Link>
        <h2 className="page-head__title">조정실</h2>
        <p className="page-head__desc">
          숙려 기간이 끝난 위시템을 다시 판단해요.
        </p>
      </div>

      {due.length === 0 ? (
        <p className="empty">
          결정할 위시템이 없어요.
          <br />
          숙려 기간이 끝나면 여기에 표시돼요.
        </p>
      ) : (
        <div className="decision-list">
          {due.map((item) => (
            <DecisionCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
