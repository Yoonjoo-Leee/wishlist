import { useSyncExternalStore } from "react";
import type { WishItem, WishStatus } from "../types";
import { loadItems, saveItems } from "./storage";
import { isAutoAbandonDue } from "./wishItems";

/**
 * 위시템 목록을 담는 모듈 단위 스토어.
 * 여러 화면이 동시에 같은 데이터를 보고, 변경 시 localStorage에 저장한다.
 */

/** 결정 대기 30일 초과 항목을 자동 퇴소(관계 종료) 처리 */
function sweepAutoAbandon(list: WishItem[]): WishItem[] {
  const now = new Date();
  let changed = false;
  const next = list.map((it) => {
    if (!isAutoAbandonDue(it, now)) return it;
    changed = true;
    return {
      ...it,
      status: "abandoned" as WishStatus,
      decisionReason: "장기 미조정으로 자동 퇴소되었습니다.",
      decidedAt: now.toISOString(),
    };
  });
  return changed ? next : list;
}

let items: WishItem[] = sweepAutoAbandon(loadItems());
saveItems(items);

const listeners = new Set<() => void>();

function setItems(next: WishItem[]) {
  items = next;
  saveItems(items);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return items;
}

export function addItem(item: WishItem) {
  setItems([item, ...items]);
}

export function updateItem(id: string, patch: Partial<WishItem>) {
  setItems(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
}

export function removeItem(id: string) {
  setItems(items.filter((it) => it.id !== id));
}

/** 구매 결정 / 구매 포기 확정 */
export function resolveItem(
  id: string,
  status: "decided" | "abandoned",
  reason: string,
) {
  updateItem(id, {
    status,
    decisionReason: reason.trim(),
    decidedAt: new Date().toISOString(),
  });
}

/** 재숙려: 새 숙려 기간으로 다시 숙려 중 상태로 */
export function reDeliberateItem(id: string, days: number) {
  const item = items.find((it) => it.id === id);
  if (!item) return;
  updateItem(id, {
    status: "deliberating",
    deliberationDays: days,
    deliberationStartedAt: new Date().toISOString(),
    reDeliberationCount: item.reDeliberationCount + 1,
  });
}

export function useWishItems() {
  const list = useSyncExternalStore(subscribe, getSnapshot);
  return { items: list, addItem, updateItem, removeItem };
}
