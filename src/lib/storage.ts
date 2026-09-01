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

  // 최초 실행: 더미 데이터로 시드
  if (!localStorage.getItem(SEEDED_KEY)) {
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
