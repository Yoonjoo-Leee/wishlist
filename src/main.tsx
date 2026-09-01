import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Decision from "./pages/Decision";
import ItemDetail from "./pages/ItemDetail";
import Stats from "./pages/Stats";
import "./index.css";

// 정적 호스팅(GitHub Pages 등)에서 새로고침·딥링크가 깨지지 않도록 해시 라우터 사용
const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "decision", element: <Decision /> },
      { path: "item/:id", element: <ItemDetail /> },
      { path: "stats", element: <Stats /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
