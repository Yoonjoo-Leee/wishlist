import { Link, NavLink, Outlet } from "react-router-dom";
import { useWishItems } from "./lib/store";
import { dueItems } from "./lib/wishItems";

function IconStatus() {
  // 장바구니(shopping cart)
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.2l2.5 11.5a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L20.5 7H6" />
    </svg>
  );
}
function IconDecision() {
  // 법봉(gavel)
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" />
      <path d="m16 16 6-6" />
      <path d="m8 8 6-6" />
      <path d="m9 7 8 8" />
      <path d="m21 11-8-8" />
      <path d="M4 21h9" />
    </svg>
  );
}
function IconStats() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 21V11M12 21V4M19 21v-6" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function IconRegister() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.4v7.2M8.4 12h7.2" />
    </svg>
  );
}

export default function App() {
  const { items } = useWishItems();
  const dueCount = dueItems(items).length;

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `tabbar__item ${isActive ? "tabbar__item--active" : ""}`;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-header__logo">욕망템 숙려캠프</span>
          <span className="app-header__tag">구매의 갈림길</span>
          <Link
            to="/settings"
            className="app-header__settings"
            aria-label="설정"
          >
            <IconSettings />
          </Link>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="tabbar">
        <div className="tabbar__inner">
          <NavLink to="/" end className={tabClass}>
            <IconStatus />
            <span>캠프 현황</span>
          </NavLink>
          <NavLink to="/decision" className={tabClass}>
            <span className="tabbar__icon-wrap">
              <IconDecision />
              {dueCount > 0 && <span className="tabbar__badge">{dueCount}</span>}
            </span>
            <span>조정실</span>
          </NavLink>
          <NavLink to="/stats" className={tabClass}>
            <IconStats />
            <span>캠프 기록</span>
          </NavLink>
          <NavLink to="/register" className={tabClass}>
            <IconRegister />
            <span>입소</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
