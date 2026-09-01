import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removeItem, updateItem, useWishItems } from "../lib/store";
import WishItemForm, { type WishFormValues } from "../components/WishItemForm";
import {
  CATEGORY_SLUG,
  STATUS_LABEL,
  daysLeft,
  daysOverdue,
  deliberationEndsAt,
  deliberationStartAt,
  displayHost,
  formatDate,
  formatPrice,
  isDecisionDue,
} from "../lib/wishItems";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items } = useWishItems();
  const [editing, setEditing] = useState(false);

  const item = items.find((it) => it.id === id);

  if (!item) {
    return (
      <div className="page">
        <div className="page-head">
          <Link to="/" className="back-link">← 홈</Link>
          <h2 className="page-head__title">위시템을 찾을 수 없어요</h2>
          <p className="page-head__desc">이미 삭제되었거나 잘못된 주소예요.</p>
        </div>
      </div>
    );
  }

  const catSlug = CATEGORY_SLUG[item.category] ?? "etc";
  const due = isDecisionDue(item);

  function handleSave(values: WishFormValues) {
    updateItem(item!.id, values);
    setEditing(false);
  }

  function handleDelete() {
    if (!window.confirm(`'${item!.name}'을(를) 삭제할까요?`)) return;
    removeItem(item!.id);
    navigate("/");
  }

  let statusText: string;
  if (item.status === "deliberating") {
    statusText = due
      ? `결정 대기 · ${daysOverdue(item)}일 지남`
      : `숙려 중 · D-${daysLeft(item)}`;
  } else {
    statusText = `${STATUS_LABEL[item.status]}${
      item.decidedAt ? ` · ${formatDate(item.decidedAt)}` : ""
    }`;
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/" className="back-link">← 홈</Link>
        <div className="detail-title">
          <span className={`wish-card__category wish-card__category--${catSlug}`}>
            {item.category}
          </span>
          <span
            className={`status-tag status-tag--${
              due ? "due" : item.status
            }`}
          >
            {statusText}
          </span>
        </div>
        <h2 className="page-head__title">{item.name}</h2>
        <p className="detail-price">{formatPrice(item.price)}</p>
      </div>

      {editing ? (
        <WishItemForm
          initial={item}
          submitLabel="저장"
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          {due && (
            <Link to="/decision" className="decision-banner">
              <span>숙려 기간이 끝났어요. 지금 결정하기</span>
              <span aria-hidden>→</span>
            </Link>
          )}

          <section className="detail-section">
            <h3 className="detail-section__title">상품 정보</h3>
            <dl className="detail">
              <div className="detail__row">
                <dt>상품명</dt>
                <dd>{item.name}</dd>
              </div>
              <div className="detail__row">
                <dt>가격</dt>
                <dd>{formatPrice(item.price)}</dd>
              </div>
              <div className="detail__row">
                <dt>카테고리</dt>
                <dd>{item.category}</dd>
              </div>
              <div className="detail__row">
                <dt>링크</dt>
                <dd>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="detail-link"
                    >
                      {displayHost(item.url)} ↗
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="detail-section">
            <h3 className="detail-section__title">입소 정보</h3>
            <dl className="detail">
              <div className="detail__row">
                <dt>입소일</dt>
                <dd>{formatDate(item.createdAt)}</dd>
              </div>
            </dl>
            <div className="detail__reason">
              <span className="detail__reason-label">입소 사유</span>
              <p>{item.reason}</p>
            </div>
          </section>

          <section className="detail-section">
            <h3 className="detail-section__title">숙려 정보</h3>
            <dl className="detail">
              <div className="detail__row">
                <dt>상태</dt>
                <dd>{statusText}</dd>
              </div>
              <div className="detail__row">
                <dt>숙려 기간</dt>
                <dd>{item.deliberationDays}일</dd>
              </div>
              <div className="detail__row">
                <dt>숙려 시작</dt>
                <dd>{formatDate(deliberationStartAt(item).toISOString())}</dd>
              </div>
              <div className="detail__row">
                <dt>숙려 종료</dt>
                <dd>{formatDate(deliberationEndsAt(item).toISOString())}</dd>
              </div>
              <div className="detail__row">
                <dt>유예</dt>
                <dd>{item.reDeliberationCount}회</dd>
              </div>
            </dl>
            {item.status !== "deliberating" && item.decisionReason && (
              <div className="detail__reason">
                <span className="detail__reason-label">
                  {STATUS_LABEL[item.status]} 이유
                </span>
                <p>{item.decisionReason}</p>
              </div>
            )}
          </section>

          <div className="detail-buttons">
            <button className="btn-ghost" onClick={() => setEditing(true)}>
              수정
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}
