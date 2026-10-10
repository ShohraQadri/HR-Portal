# PeopleHub — Enterprise HRMS & Employee Experience Platform

> **Portfolio Prototype Notice:** PeopleHub is an interactive frontend engineering prototype and portfolio showcase inspired by enterprise HR platforms such as ZingHR. All employee data, credentials, and records are fictional simulations stored locally via an isolated multi-tenant storage abstraction. It is not connected to a live physical presence tracking or payroll banking system.

---

## 🌟 Product Vision & Overview

**PeopleHub** is a customizable enterprise HRMS and workplace experience platform built for distributed, hybrid, and in-office organizations. Rather than a static set of mockup screens, PeopleHub delivers interactive enterprise workflows spanning daily biometric attendance tracking, leave management, SLA-backed service requests, rewards & recognition, talent performance cycles, learning paths, recruitment funnels, and real-time company branding personalization.

The platform is architected around three distinct role-based experiences:
1. **Employee Experience**: Self-service check-in/out desk, leave balances, peer recognitions, payslips, and support query tickets.
2. **Manager Experience**: Real-time team attendance overview, approval inbox (leave requests & ticket triage), and SLA compliance tracking.
3. **HR / Administrator Experience**: Organization-wide talent metrics, dynamic theme & brand tokens customizer, attendance shift policies, recruitment pipelines, and security audit logs.

---

## 🎨 Company Branding & Dynamic Appearance Customization

Every organization can personalize its workplace theme via **Settings → Branding & Appearance**:
- **Default Lavender Calm Theme**: Tailored design tokens (`#8B7BC8` primary, `#F2EEFC` subtle lavender surface, `#FAF9FD` page background, `#252438` slate text).
- **5 Curated Theme Presets**:
  - **Lavender Calm**: Focused, soft, modern enterprise aesthetic (Default).
  - **Ocean Blue**: Crisp, trustworthy corporate technology palette (`#3B82F6`).
  - **Emerald Growth**: Refreshing, balanced, natural performance tones (`#10B981`).
  - **Rose Quartz**: Warm, human-centered culture atmosphere (`#E11D48`).
  - **Midnight Slate**: High-contrast dark mode styling for engineering teams (`#818CF8`).
- **Interactive Color Picker**: Live hex/RGB picker applying CSS variables dynamically across buttons, badges, navigation indicators, and borders without page reloads.
- **Sidebar Variations**: Light, Lavender-Tinted Subtle, and Deep Slate Contrast.
- **Dark Mode**: Accessible contrast dark theme toggle.
- **Custom Logo Upload**: Real-time image upload preview with fallback brand marks.
- **Persistent Preferences**: Local storage abstraction preserving tenant customizations across browser sessions.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS Variable Design Tokens
- **Routing**: [React Router v7](https://reactrouter.com/) (Nested shell layout, role guards)
- **State & Data Caching**: [TanStack Query v5](https://tanstack.com/query)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Visualizations**: [Recharts](https://recharts.org/) (Attendance trends, department distributions, SLA ratios)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns v4](https://date-fns.org/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

---

## 🚀 Key Modules & Capabilities

### 1. Daily Attendance & Time Management
- **Punch In / Punch Out**: Interactive clock with real-time session tracking.
- **Dynamic Duration Calculation**: Automatically calculates worked hours from punch timestamps, factoring in break times.
- **Policy Enforcement**: Prevents duplicate check-ins; enforces check-in before check-out; detects late arrival (grace period past 09:15 AM).
- **Regularization Workflow**: Employee attendance correction request modal submitted to manager approval inbox.
- **History & CSV Export**: Searchable historical attendance table with status filters (Present, Late, On Leave, Absent) and one-click CSV export.

### 2. Leave & Time-Off Management
- **Category Balances**: Annual Paid Vacation, Casual Leave, Sick/Medical Leave, and Parental Leave.
- **Application Engine**: Date range picker with business day calculation, half-day toggle, balance check, and overlap detection.
- **Approval Workflow**: Manager approval and rejection with contextual comments.

### 3. Employee Directory & 9-Tab Profile
- **Toggleable Views**: Seamless switch between responsive Grid cards and Enterprise Data Table.
- **Multi-parameter Search**: Search by employee name, ID, department, or job title.
- **Comprehensive 9-Tab Profile**:
  1. *Overview*: Bio, manager hierarchy, and direct contact details.
  2. *Personal Information*: Editable contact details and emergency contacts.
  3. *Employment Details*: Employee ID, job title, department, and shift details.
  4. *Attendance*: Monthly shift breakdown and worked hours.
  5. *Leave & Balances*: Available vs. used quota breakdown.
  6. *Documents*: Monthly certified payslip statements with text file download.
  7. *Performance*: Active OKRs with live progress bars.
  8. *Recognition*: Received awards and public badges.
  9. *Learning History*: Completed courses and certifications.

### 4. Rewards & Recognition
- **Public Culture Stream**: Organization-wide feed celebrating achievements.
- **Badge Gallery**: Star Performer, Innovation Champion, Team Player, Customer Hero, Learning Champion, and Excellence Award.
- **Interactive Cheers**: Colleague like/cheer counter.
- **Monthly Leaderboard**: Highlights top points earners.

### 5. Service Requests & SLA Governance
- **Multi-category Triage**: IT Hardware, HR Inquiries, Facilities & Badges, Finance Reimbursements.
- **SLA Tracking**: Automated SLA calculation (+3 days) with overdue warning badges.
- **Ticket Activity Timeline**: Threaded updates, comment history, and status lifecycle transitions (`Under Review` → `In Progress` → `Resolved` → `Closed`).

### 6. Additional HRMS Modules
- **Performance Management**: OKR tracking, self-review submission, and manager rating summaries.
- **Learning & Development**: Course catalog with enrollment progress and completion badges.
- **Recruitment Funnel**: Requisition cards with 5-stage pipeline funnel (Applied, Screening, Interview, Offer, Hired) and interview scheduler.
- **Announcements & Calendar**: Corporate news, public holiday schedule, birthdays, and work anniversaries.
- **Company Policies**: Searchable corporate handbook with compliance tags.
- **Reports & Analytics**: Recharts attendance trends, department distribution, and ticket SLA compliance.
- **Audit Logs**: Immutable log table recording administrative actions, timestamps, and IP addresses.

---

## 👥 Demo Personas & Roles

You can switch roles instantly in the top navigation bar to test different user experiences:

| Role | Demo Persona | Title & Department | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Employee** | Sophia Reed | Senior Product Designer (Product & Design) | Daily check-in/out, leave applications, view payslips, submit tickets, peer recognition. |
| **Manager** | Marcus Vance | VP of Engineering (Engineering) | Team attendance overview, direct reports directory, pending approvals inbox, SLA tracking. |
| **HR / Admin** | Elena Rostova | Chief People Officer & Admin (HR) | Executive dashboards, theme customizer, attendance policies, recruitment pipeline, audit logs. |

---

## 📁 Project Structure

```text
peoplehub/
├── public/
│   └── favicon.svg               # Brand mark SVG favicon
├── src/
│   ├── components/
│   │   ├── layout/               # Shell, Sidebar, Header, MobileDrawer
│   │   └── ui/                   # Button, Card, Badge, Modal, Input, Select, Avatar, StatCard, etc.
│   ├── context/
│   │   ├── AuthContext.tsx       # Demo role management & user switching
│   │   ├── ThemeContext.tsx      # CSS variable injection, presets, and dark mode
│   │   └── ToastContext.tsx      # System feedback notifications
│   ├── features/
│   │   ├── dashboard/            # Role-specific dashboards (Employee, Manager, Admin)
│   │   ├── attendance/           # Punch desk, regularization modal, history table
│   │   ├── leave/                # Balance cards, apply modal, approval flows
│   │   ├── employees/            # Searchable directory & 9-tab profile
│   │   ├── recognition/          # Culture stream, give recognition modal, leaderboard
│   │   ├── requests/             # Service request tickets & conversation threads
│   │   ├── approvals/            # Centralized manager/HR approvals inbox
│   │   ├── performance/          # OKRs and self-review modal
│   │   ├── learning/             # Course catalog & certification tracking
│   │   ├── recruitment/          # Requisitions & candidate pipeline
│   │   ├── announcements/        # News broadcasts & holiday schedule
│   │   ├── policies/             # Searchable employee handbook
│   │   ├── teams/                # Department breakdown & leads
│   │   ├── reports/              # Visual Recharts analytics & exports
│   │   └── settings/             # Branding customization, shift policies, audit logs
│   ├── services/
│   │   ├── apiService.ts         # Typed reactive service mimicking backend operations
│   │   └── mockData.ts           # Realistic enterprise dataset
│   ├── test/                     # Vitest test suites (attendance, leave, theme, requests)
│   ├── types/
│   │   └── index.ts              # Domain TypeScript types
│   ├── utils/
│   │   ├── cn.ts                 # Classname utility
│   │   ├── formatters.ts         # Date, currency, badge formatters
│   │   └── storage.ts            # Local persistence abstraction
│   ├── App.tsx                   # Route hierarchy & TanStack Query configuration
│   ├── index.css                 # CSS variable definitions, base resets, scrollbar
│   └── main.tsx                  # React DOM mount point
├── package.json
├── tailwind.config.js            # Tailwind tokens mapped to CSS custom properties
├── tsconfig.json
└── vite.config.ts                # Vite & Vitest configuration
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js `^20.19.0 || >=22.12.0` (or Node 22 via NVM)
- npm `10+`

### Installation & Run

1. Clone or navigate to the repository directory:
   ```bash
   cd peoplehub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

---

## 🧪 Testing

PeopleHub includes unit and integration tests covering core workflows:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Test Coverage Includes:
- `attendance.test.ts`: Check-in timestamps, duplicate prevention, and worked hours computation.
- `leave.test.ts`: Leave submission, date overlap rejection, and manager approval balance updates.
- `theme.test.tsx`: Lavender default initialization, preset switching, and dark mode class toggling.
- `requests.test.ts`: Service ticket ID generation, SLA deadlines, and comment threads.

---

## 🔒 Production Architecture & Future Backend Roadmap

While this prototype operates with a client-authoritative mock service and local persistence for demonstration purposes, an enterprise production deployment would connect to a dedicated backend architecture:

1. **Server-Authoritative Timestamps**: Physical biometric clock integration and NTP-synchronized server time to prevent client clock manipulation.
2. **Tenant Isolation**: Multi-tenant database schemas with PostgreSQL Row-Level Security (RLS) or partitioned tenant databases.
3. **Authentication & Authorization**: OAuth2 / SAML SSO integration with Role-Based Access Control (RBAC) enforced on every API endpoint.
4. **Document Storage**: Secure private object storage (e.g., S3, Google Cloud Storage) with signed temporary download URLs for payslips and doctor notes.
5. **Real-time WebSockets**: Push notifications for approval alerts and ticket updates.

---

## 📄 License

MIT License. Built for portfolio presentation and innovation demonstrations.
