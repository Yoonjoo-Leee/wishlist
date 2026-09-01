import { Link, useNavigate } from "react-router-dom";
import type { WishItem } from "../types";
import { addItem } from "../lib/store";
import WishItemForm, { type WishFormValues } from "../components/WishItemForm";

export default function Register() {
  const navigate = useNavigate();

  function handleSubmit(values: WishFormValues) {
    const item: WishItem = {
      id: crypto.randomUUID(),
      ...values,
      createdAt: new Date().toISOString(),
      status: "deliberating",
      reDeliberationCount: 0,
    };
    addItem(item);
    navigate("/");
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/" className="back-link">← 홈</Link>
        <h2 className="page-head__title">위시템 등록</h2>
        <p className="page-head__desc">
          바로 사지 말고, 숙려 기간을 두고 다시 판단해요.
        </p>
      </div>

      <WishItemForm submitLabel="숙려 시작하기" onSubmit={handleSubmit} />
    </div>
  );
}
