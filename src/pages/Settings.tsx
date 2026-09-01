import { Link } from "react-router-dom";
import { loadSampleData, resetAll, useWishItems } from "../lib/store";

export default function Settings() {
  const { items } = useWishItems();

  function handleReset() {
    if (
      !window.confirm(
        `위시템 ${items.length}건을 모두 삭제할까요? 되돌릴 수 없어요.`,
      )
    )
      return;
    resetAll();
  }

  function handleLoadSample() {
    const msg =
      items.length > 0
        ? `현재 위시템 ${items.length}건이 예시 데이터로 교체됩니다. 계속할까요?`
        : "예시 데이터를 채울까요?";
    if (!window.confirm(msg)) return;
    loadSampleData();
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/" className="back-link">← 캠프 현황</Link>
        <h2 className="page-head__title">설정</h2>
      </div>

      <section className="detail-section">
        <h3 className="detail-section__title">데이터</h3>
        <dl className="detail">
          <div className="detail__row">
            <dt>저장 위치</dt>
            <dd>이 브라우저 (localStorage)</dd>
          </div>
          <div className="detail__row">
            <dt>현재 위시템</dt>
            <dd>{items.length}건</dd>
          </div>
        </dl>
        <p className="settings-note">
          데이터는 이 브라우저에만 저장돼요. 다른 기기·브라우저와 공유되지 않습니다.
        </p>

        <div className="settings-actions">
          <button className="btn-ghost" onClick={handleLoadSample}>
            예시 데이터 채우기
          </button>
          <button className="btn-danger" onClick={handleReset}>
            전체 초기화
          </button>
        </div>
      </section>
    </div>
  );
}
