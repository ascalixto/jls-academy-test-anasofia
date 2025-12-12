import { Routes, Route } from "react-router-dom"

import { AppLayout } from "./components/layout/AppLayout"
import { DashboardPage } from "./pages/DashboardPage"
import { LayoutSandboxPage } from "./pages/LayoutSandboxPage"
import { HelpPage } from "./pages/HelpPage"
import { ComponentsPage } from "./pages/ComponentsPage"
import { SettingsLayout } from "./pages/SettingsLayout"
import { SettingsProfilePage } from "./pages/SettingsProfilePage"
import { SettingsNotificationsPage } from "./pages/SettingsNotificationsPage"
import { QualityCheckPage } from "./pages/QualityCheckPage"
import { NotFoundPage } from "./pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Sandbox */}
        <Route path="layout-sandbox" element={<LayoutSandboxPage />} />
        <Route path="components" element={<ComponentsPage />} />

        {/* Settings (nested) */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<SettingsProfilePage />} />
          <Route
            path="notifications"
            element={<SettingsNotificationsPage />}
          />
        </Route>

        {/* System */}
        <Route path="help" element={<HelpPage />} />
        <Route path="quality-check" element={<QualityCheckPage />} />

        {/* 404 — SEMPRE por último */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
