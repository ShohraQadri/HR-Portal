import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { AppLayout } from '@/components/layout/AppLayout'

// Feature Pages
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProfilePage } from '@/features/employees/ProfilePage'
import { DirectoryPage } from '@/features/employees/DirectoryPage'
import { AttendancePage } from '@/features/attendance/AttendancePage'
import { LeavePage } from '@/features/leave/LeavePage'
import { RequestsPage } from '@/features/requests/RequestsPage'
import { ApprovalsPage } from '@/features/approvals/ApprovalsPage'
import { RecognitionPage } from '@/features/recognition/RecognitionPage'
import { PerformancePage } from '@/features/performance/PerformancePage'
import { LearningPage } from '@/features/learning/LearningPage'
import { AnnouncementsPage } from '@/features/announcements/AnnouncementsPage'
import { PoliciesPage } from '@/features/policies/PoliciesPage'
import { TeamsPage } from '@/features/teams/TeamsPage'
import { RecruitmentPage } from '@/features/recruitment/RecruitmentPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { BrandingPage } from '@/features/settings/BrandingPage'
import { AttendancePoliciesPage } from '@/features/settings/AttendancePoliciesPage'
import { AuditLogsPage } from '@/features/settings/AuditLogsPage'
import { GeneralSettingsPage } from '@/features/settings/GeneralSettingsPage'
import { LoginPage } from '@/features/auth/LoginPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Application Routes */}
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/directory" element={<DirectoryPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/leave" element={<LeavePage />} />
                  <Route path="/requests" element={<RequestsPage />} />
                  <Route path="/approvals" element={<ApprovalsPage />} />
                  <Route path="/recognition" element={<RecognitionPage />} />
                  <Route path="/performance" element={<PerformancePage />} />
                  <Route path="/learning" element={<LearningPage />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/policies" element={<PoliciesPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/recruitment" element={<RecruitmentPage />} />
                  <Route path="/reports" element={<ReportsPage />} />

                  {/* Settings routes */}
                  <Route path="/settings" element={<GeneralSettingsPage />} />
                  <Route path="/settings/branding" element={<BrandingPage />} />
                  <Route path="/settings/attendance" element={<AttendancePoliciesPage />} />
                  <Route path="/settings/audit" element={<AuditLogsPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
