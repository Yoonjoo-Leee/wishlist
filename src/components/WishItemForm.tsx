import { useState } from "react";
import { CATEGORIES, type WishCategory } from "../types";

const DELIBERATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export interface WishFormValues {
  url: string;
  name: string;
  price: number;
  category: WishCategory;
  reason: string;
  deliberationDays: number;
}

interface Props {
  initial?: Partial<WishFormValues>;
  submitLabel: string;
  onSubmit: (values: WishFormValues) => void;
  onCancel?: () => void;
}

function parsePrice(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function formatPriceInput(raw: string): string {
  const n = parsePrice(raw);
  return n ? n.toLocaleString("ko-KR") : "";
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type Errors = Partial<Record<"url" | "name" | "price" | "reason", string>>;

export default function WishItemForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [url, setUrl] = useState(initial?.url ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial?.price ? initial.price.toLocaleString("ko-KR") : "",
  );
  const [category, setCategory] = useState<WishCategory>(
    initial?.category ?? "기타",
  );
  const [reason, setReason] = useState(initial?.reason ?? "");
  const [deliberationDays, setDeliberationDays] = useState(
    initial?.deliberationDays ?? 3,
  );
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!url.trim()) next.url = "상품 링크를 입력해 주세요.";
    if (!name.trim()) next.name = "상품명을 입력해 주세요.";
    if (parsePrice(price) <= 0) next.price = "가격을 입력해 주세요.";
    if (!reason.trim()) next.reason = "입소 사유를 적어 주세요.";
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      url: normalizeUrl(url),
      name: name.trim(),
      price: parsePrice(price),
      category,
      reason: reason.trim(),
      deliberationDays,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field__label">상품 링크</span>
        <input
          className="field__input"
          type="url"
          inputMode="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {errors.url && <span className="field__error">{errors.url}</span>}
      </label>

      <label className="field">
        <span className="field__label">상품명</span>
        <input
          className="field__input"
          type="text"
          placeholder="예: 노이즈 캔슬링 이어폰"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="field__error">{errors.name}</span>}
      </label>

      <label className="field">
        <span className="field__label">가격</span>
        <div className="field__affix">
          <input
            className="field__input"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(formatPriceInput(e.target.value))}
          />
          <span className="field__unit">원</span>
        </div>
        {errors.price && <span className="field__error">{errors.price}</span>}
      </label>

      <div className="field">
        <span className="field__label">
          카테고리 <span className="field__optional">(선택)</span>
        </span>
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              className={`chip ${category === c ? "chip--on" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="field__label">입소 사유</span>
        <textarea
          className="field__input field__textarea"
          rows={3}
          placeholder="지금 이걸 사고 싶은 이유를 솔직하게 적어 두면, 나중에 판단할 때 도움이 돼요."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        {errors.reason && <span className="field__error">{errors.reason}</span>}
      </label>

      <div className="field">
        <span className="field__label">숙려 기간</span>
        <div className="segmented">
          {DELIBERATION_OPTIONS.map((d) => (
            <button
              type="button"
              key={d}
              className={`segmented__item ${
                deliberationDays === d ? "segmented__item--on" : ""
              }`}
              onClick={() => setDeliberationDays(d)}
            >
              {d}일
            </button>
          ))}
        </div>
      </div>

      <div className="form__actions">
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
