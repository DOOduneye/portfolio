import { lazy, Suspense } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { queryClient } from "./api"
import { Home } from "./pages/Home"
import { Writing } from "./pages/Writing"

const Admin = lazy(() => import("./admin/Admin").then(m => ({ default: m.Admin })))
const Post = lazy(() => import("./pages/Post").then(m => ({ default: m.Post })))

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route
            path="/writing/:slug"
            element={
              <Suspense fallback={null}>
                <Post />
              </Suspense>
            }
          />
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
    </QueryClientProvider>
  )
}
