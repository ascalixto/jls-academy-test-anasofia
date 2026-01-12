// src/App.tsx
import { Routes, Route } from "react-router-dom"

import { AppLayout } from "./components/layout/AppLayout"
import { DashboardPage } from "./pages/DashboardPage"
import { LayoutSandboxPage } from "./pages/LayoutSandboxPage"
import { HelpPage } from "./pages/HelpPage"
import { ComponentsPage } from "./pages/ComponentsPage"
import { SettingsLayout } from "./pages/SettingsLayout"
import SettingsPage from "./pages/SettingsPage"
import { SettingsNotificationsPage } from "./pages/SettingsNotificationsPage"
import CreateToolPage from "./pages/CreateToolPage"
import { QualityCheckPage } from "./pages/QualityCheckPage"
import { NotFoundPage } from "./pages/NotFoundPage"

// Ideas
import IdeasPage from "./pages/IdeasPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />

        {/* Ideas */}
        <Route path="ideas" element={<IdeasPage />} />

        {/* Sandbox */}
        <Route path="layout-sandbox" element={<LayoutSandboxPage />} />
        <Route path="components" element={<ComponentsPage />} />

        {/* Settings (nested) */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<SettingsPage />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
        </Route>

        {/* Tools */}
        <Route path="create-tool" element={<CreateToolPage />} />

        {/* System */}
        <Route path="help" element={<HelpPage />} />
        <Route path="quality-check" element={<QualityCheckPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
