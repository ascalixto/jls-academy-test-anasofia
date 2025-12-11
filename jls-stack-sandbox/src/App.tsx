import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { DashboardPage } from "@/pages/DashboardPage"
import { LayoutSandboxPage } from "@/pages/LayoutSandboxPage"
import { HelpPage } from "@/pages/HelpPage"
import { ComponentsPage } from "@/pages/ComponentsPage"
import { SettingsLayout } from "@/pages/SettingsLayout"
import { SettingsProfilePage } from "@/pages/SettingsProfilePage"
import { SettingsNotificationsPage } from "@/pages/SettingsNotificationsPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* "/" → Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* "/layout-sandbox" */}
        <Route path="layout-sandbox" element={<LayoutSandboxPage />} />

        {/* "/components" */}
        <Route path="components" element={<ComponentsPage />} />

        {/* "/settings" com rotas aninhadas */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<SettingsProfilePage />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
        </Route>

        {/* "/help" */}
        <Route path="help" element={<HelpPage />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
