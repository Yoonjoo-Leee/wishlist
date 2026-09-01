import type { WishItem } from "../types";
import { DUMMY_ITEMS } from "./dummyData";

const STORAGE_KEY = "wishlist-deliberation/items/v1";
const SEEDED_KEY = "wishlist-deliberation/seeded/v1";

export function loadItems(): WishItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as WishItem[];
    }
  } catch (err) {
    console.warn("위시템 로드 실패, 초기화합니다.", err);
  }

  // 개발 환경에서만 최초 1회 예시 데이터로 시드한다.
  // 배포본은 빈 상태로 시작하고, 샘플이 필요하면 설정 화면에서 직접 채운다.
  if (import.meta.env.DEV && !localStorage.getItem(SEEDED_KEY)) {
    saveItems(DUMMY_ITEMS);
    localStorage.setItem(SEEDED_KEY, "1");
    return DUMMY_ITEMS;
  }
  return [];
}

export function saveItems(items: WishItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("위시템 저장 실패", err);
  }
}
