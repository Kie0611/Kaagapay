import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { HomePage } from "@/routes/index";
import { ResourcesPage } from "@/routes/resources.index";
import { ResourceDetailPage } from "@/routes/resources.$id";
import { SubmitPage } from "@/routes/submit";
import { AdminPage }  from "@/routes/admin";
import { AboutPage, ContactPage } from "@/routes/about-contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/resources"     element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<ResourceDetailPage />} />
        <Route path="/submit"        element={<SubmitPage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/contact"       element={<ContactPage />} />
        <Route path="/admin"         element={<AdminPage />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}