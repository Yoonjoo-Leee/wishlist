import type { WishCategory, WishItem } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface AmountStats {
  /** 총 위시금액 (전체 항목) */
  total: number;
  /** 숙려 중 금액 */
  deliberating: number;
  /** 구매 결정 금액 */
  decided: number;
  /** 구매 포기 금액 */
  abandoned: number;
}

export function amountStats(items: WishItem[]): AmountStats {
  return items.reduce<AmountStats>(
    (acc, it) => {
      acc.total += it.price;
      acc[it.status] += it.price;
      return acc;
    },
    { total: 0, deliberating: 0, decided: 0, abandoned: 0 },
  );
}

export interface CategoryStat {
  category: WishCategory;
  count: number;
  total: number;
  decided: number;
  abandoned: number;
}

/** 항목이 있는 카테고리만, 총액 내림차순 */
export function categoryStats(items: WishItem[]): CategoryStat[] {
  const map = new Map<WishCategory, CategoryStat>();
  for (const it of items) {
    const s =
      map.get(it.category) ??
      {
        category: it.category,
        count: 0,
        total: 0,
        decided: 0,
        abandoned: 0,
      };
    s.count += 1;
    s.total += it.price;
    if (it.status === "decided") s.decided += it.price;
    if (it.status === "abandoned") s.abandoned += it.price;
    map.set(it.category, s);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

/** 전체 항목의 평균 숙려 기간(일). 소수 첫째 자리 반올림 */
export function averageDeliberationDays(items: WishItem[]): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((a, it) => a + it.deliberationDays, 0);
  return Math.round((sum / items.length) * 10) / 10;
}

/** 결정된 항목의 등록→결정 평균 소요일. 대상 없으면 0 */
export function averageDaysToDecision(items: WishItem[]): number {
  const resolved = items.filter(
    (it) => it.status !== "deliberating" && it.decidedAt,
  );
  if (resolved.length === 0) return 0;
  const sum = resolved.reduce((a, it) => {
    const days =
      (new Date(it.decidedAt!).getTime() - new Date(it.createdAt).getTime()) /
      DAY_MS;
    return a + Math.max(0, days);
  }, 0);
  return Math.round((sum / resolved.length) * 10) / 10;
}

export interface ResolvedStats {
  decided: number;
  abandoned: number;
  /** 구매 포기율 (0~1). 결정된 항목이 없으면 0 */
  abandonRate: number;
}

export function resolvedStats(items: WishItem[]): ResolvedStats {
  const decided = items.filter((it) => it.status === "decided").length;
  const abandoned = items.filter((it) => it.status === "abandoned").length;
  const denom = decided + abandoned;
  return {
    decided,
    abandoned,
    abandonRate: denom === 0 ? 0 : abandoned / denom,
  };
}
