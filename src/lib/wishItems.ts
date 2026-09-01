import type { WishItem, WishStatus } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** 재숙려 최대 횟수 */
export const MAX_REDELIBERATION = 2;
/** 결정 대기 상태로 이 일수를 넘기면 자동 퇴소(관계 종료) */
export const AUTO_ABANDON_DAYS = 30;

/** 현재 숙려 시작 시각 (재숙려했으면 그 시점, 아니면 등록 시점) */
export function deliberationStartAt(item: WishItem): Date {
  return new Date(item.deliberationStartedAt ?? item.createdAt);
}

/** 숙려 종료 시각 (숙려 시작 + 숙려기간) */
export function deliberationEndsAt(item: WishItem): Date {
  return new Date(deliberationStartAt(item).getTime() + item.deliberationDays * DAY_MS);
}

/** 숙려기간이 도래했는지 (결정 대기 상태) */
export function isDecisionDue(item: WishItem, now: Date = new Date()): boolean {
  return item.status === "deliberating" && now >= deliberationEndsAt(item);
}

/** 결정 대기 상태에서 며칠 지났는지 */
export function daysOverdue(item: WishItem, now: Date = new Date()): number {
  return Math.floor((now.getTime() - deliberationEndsAt(item).getTime()) / DAY_MS);
}

/** 재숙려가 아직 가능한지 */
export function canReDeliberate(item: WishItem): boolean {
  return item.reDeliberationCount < MAX_REDELIBERATION;
}

/** 결정 대기 30일 초과 → 자동 퇴소 대상 */
export function isAutoAbandonDue(item: WishItem, now: Date = new Date()): boolean {
  return isDecisionDue(item, now) && daysOverdue(item, now) > AUTO_ABANDON_DAYS;
}

/** 결정 대기(숙려 종료) 항목만 */
export function dueItems(items: WishItem[], now: Date = new Date()): WishItem[] {
  return items.filter((it) => isDecisionDue(it, now));
}

/** 숙려 종료까지 남은 일수 (올림, 최소 0) */
export function daysLeft(item: WishItem, now: Date = new Date()): number {
  const diff = deliberationEndsAt(item).getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / DAY_MS));
}

/** 숙려 진행률 0~1 (숙려 시작 → 종료 기준, 범위 밖은 clamp) */
export function deliberationProgress(item: WishItem, now: Date = new Date()): number {
  const start = deliberationStartAt(item).getTime();
  const end = deliberationEndsAt(item).getTime();
  if (end <= start) return 1;
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
}

/** 등록 후 경과 일수 */
export function daysSinceCreated(item: WishItem, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(item.createdAt).getTime()) / DAY_MS);
}

export interface StatusCounts {
  deliberating: number;
  decided: number;
  abandoned: number;
}

export function countByStatus(items: WishItem[]): StatusCounts {
  return items.reduce<StatusCounts>(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { deliberating: 0, decided: 0, abandoned: 0 },
  );
}

export function itemsByStatus(items: WishItem[], status: WishStatus): WishItem[] {
  return items.filter((item) => item.status === status);
}

export const STATUS_LABEL: Record<WishStatus, string> = {
  deliberating: "숙려 중",
  decided: "구매 승인",
  abandoned: "관계 종료",
};

/** 카테고리 → CSS에서 쓰는 색상 슬러그 */
export const CATEGORY_SLUG: Record<string, string> = {
  패션: "fashion",
  전자기기: "tech",
  리빙: "living",
  뷰티: "beauty",
  취미: "hobby",
  식품: "food",
  기타: "etc",
};

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

/** 등록일자 표기: 2026. 8. 30. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}

/** URL에서 표시용 호스트명 추출 (실패 시 원본 반환) */
export function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
