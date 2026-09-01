import { NavLink, Outlet } from "react-router-dom";
import { useWishItems } from "./lib/store";
import { dueItems } from "./lib/wishItems";

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function IconDecision() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12 2.6 2.6L15.7 9" />
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
          <span className="app-header__tag">사기 전에, 며칠만</span>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="tabbar">
        <div className="tabbar__inner">
          <NavLink to="/" end className={tabClass}>
            <IconHome />
            <span>홈</span>
          </NavLink>
          <NavLink to="/decision" className={tabClass}>
            <span className="tabbar__icon-wrap">
              <IconDecision />
              {dueCount > 0 && <span className="tabbar__badge">{dueCount}</span>}
            </span>
            <span>결정</span>
          </NavLink>
          <NavLink to="/stats" className={tabClass}>
            <IconStats />
            <span>통계</span>
          </NavLink>
          <NavLink to="/register" className={tabClass}>
            <IconRegister />
            <span>등록</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
