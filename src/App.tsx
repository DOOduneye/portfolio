import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";

// Admin (and TipTap with it) only loads on /admin — visitors never pay for it.
const Admin = lazy(() =>
  import("./admin/Admin").then((m) => ({ default: m.Admin }))
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
