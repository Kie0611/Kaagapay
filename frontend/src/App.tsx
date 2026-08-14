import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { HomePage } from "@/routes/HomePage";
import { ResourcesPage } from "@/routes/ResourcesPage";
import { ResourceDetailPage } from "@/routes/ResourceDetailPage";
import { SubmitPage } from "@/routes/SubmitPage";
import { AdminPage } from "@/routes/AdminPage";
import { AboutPage } from "@/routes/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/resources"     element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<ResourceDetailPage />} />
        <Route path="/submit"        element={<SubmitPage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/admin"         element={<AdminPage />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}