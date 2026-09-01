export type WishStatus = "deliberating" | "decided" | "abandoned";

export type WishCategory =
  | "패션"
  | "전자기기"
  | "리빙"
  | "뷰티"
  | "취미"
  | "식품"
  | "기타";

export const CATEGORIES: WishCategory[] = [
  "패션",
  "전자기기",
  "리빙",
  "뷰티",
  "취미",
  "식품",
  "기타",
];

export interface WishItem {
  id: string;
  /** 상품 링크 */
  url: string;
  /** 상품명 */
  name: string;
  /** 가격 (원) */
  price: number;
  category: WishCategory;
  /** 사고 싶은 이유 */
  reason: string;
  /** 숙려 기간 (1~7일) */
  deliberationDays: number;
  /** 등록 시각 (ISO) */
  createdAt: string;
  /** 현재 숙려 시작 시각 (ISO). 재숙려 시 갱신되며, 없으면 createdAt 기준 */
  deliberationStartedAt?: string;
  status: WishStatus;
  /** 재숙려 횟수 (최대 2) */
  reDeliberationCount: number;
  /** 결정 이유 (구매결정 / 구매포기 시 작성) */
  decisionReason?: string;
  /** 결정 시각 (ISO) */
  decidedAt?: string;
}
