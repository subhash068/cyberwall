# CYBERWALL — NGFW Management Platform (Frontend Only)

Build the CYBERWALL Next-Generation Firewall management platform per the uploaded master spec, adapted to this project's existing stack (TanStack Start v1, React 19, Tailwind v4, shadcn/ui, Vite). Strictly frontend: mock data, mock auth, no backend, no real firewall behavior.

## Stack decisions (adapted from spec)

- **Routing:** TanStack Router (this project's fixed router) instead of React Router.
- **Visualizations:** Recharts for charts. Network topology: custom SVG node-graph component (lighter than React Flow, fully controlled, zoom/pan/fit/search/filter/node panels included) — avoids a heavy new dependency. Revisit React Flow only if the custom graph proves insufficient.
- **Tables:** lightweight in-house table built on shared primitives (search/sort/filter/pagination state per table), not TanStack Table — fewer deps, consistent UX.
- **State:** React context + hooks for workspace/session/UI state; no Zustand.
- **Data:** centralized `src/mock-data/` with TypeScript types in `src/types/`, mock service adapters in `src/services/` (simulated latency, CRUD, future REST swap-in).
- **Dependencies to add:** `recharts`, `sonner` (toasts). Everything else already present.

## Design system

Dark-only futuristic enterprise security theme in `src/styles.css` (oklch tokens mapped from the spec hex values):

- Backgrounds: #080D18 / #0D1525 / #142238 → deep midnight navy surfaces.
- Primary electric blue #2563EB, secondary cyan #06B6D4, intelligence purple #8B5CF6.
- Semantic states: success #22C55E, warning #F59E0B, critical #EF4444, neutral #94A3B8.
- Fonts: Inter + JetBrains Mono (technical identifiers, tabular metrics), loaded via `<link>` in `src/routes/__root.tsx`.
- Subtle grid background, restrained glows, semantic component variants (severity badges, firewall action badges, status indicators, metric cards).
- Security-specific shared components: `SeverityBadge`, `ActionBadge`, `StatusDot`, `MetricCard`, `SectionCard`, `EventTimeline`, `FilterBar`, `DataTable`, `DetailDrawer`, `EmptyState`, `DemoModeBanner`.

## Architecture

```
src/routes/
  __root.tsx              — app shell (sidebar + topbar + outlet), fonts, Toaster
  login.tsx               — Module 01 auth screens (login/MFA/forgot/reset/session-expired as tabs/states)
  admin.tsx               — pathless Admin Console layout (guards mock session)
  admin.index.tsx         — Admin overview dashboard (Module 02)
  admin.network.tsx       — Module 03 network overview + interfaces (tabs: interfaces/routing/DHCP/DNS/VLAN/WAN/LAN)
  admin.topology.tsx      — Module 05 interactive SVG topology
  admin.firewall.tsx      — Module 06 firewall policy manager (full CRUD, 8-step rule editor dialog)
  admin.nat.tsx           — Module 07 NAT
  admin.connections.tsx   — Module 08 active connections
  admin.applications.tsx  — Module 09 application control
  admin.web-security.tsx  — Module 10 DNS/web security
  admin.vpn.tsx           — Module 11 VPN
  admin.administration.tsx— Module 12 users/roles/audit/settings/backup
  soc.tsx                 — pathless SOC layout
  soc.index.tsx           — Module 13 SOC overview
  soc.alerts.tsx          — Module 14 IDS/IPS alerts
  soc.incidents.tsx       — Module 15 incident management (workflow states)
  soc.intelligence.tsx    — Module 16 threat intelligence/IOCs
  soc.mitre.tsx           — Module 17 ATT&CK matrix
  soc.network-analytics.tsx — Module 18
  soc.security-analytics.tsx— Module 19
  soc.investigation.tsx   — Module 20 investigation workspace (3-column)
  soc.reports.tsx         — Module 21 reporting
src/components/ (layout/, charts/, tables/, security/, common/)
src/mock-data/, src/types/, src/services/
```

Shell: collapsible sidebar with logo, workspace selector (Admin Console / SOC), grouped nav; topbar with appliance selector, global search + command palette (Ctrl/Cmd+K), notifications drawer, user menu, theme settings; breadcrumbs + page header per route; mobile drawer nav. Persistent DEMO MODE indicator.

## Interaction guarantees

Every control does something: tables searchable/sortable/filterable/paginated; records creatable/edited/duplicated/deleted with confirmation dialogs + validation (Zod); toasts on actions; detail drawers; interactive charts; demo auto-refresh on connections; workspace switching updates nav. Mock session via localStorage; role-aware menu visibility is demo-only (stated in UI).

## Implementation phases

1. **Foundation:** design tokens, fonts, shell (sidebar/topbar/command palette), shared components, mock auth + session, docs skeleton, route inventory test.
2. **Auth + dashboards:** login/MFA screens, Admin overview, SOC overview.
3. **Network & firewall:** network, routing, topology, firewall policies, NAT, connections.
4. **Security ops:** alerts, incidents, intelligence, MITRE, investigation.
5. **Advanced modules:** application control, web security, VPN, analytics, reports, administration.
6. **QA:** responsive checks (Playwright screenshots at desktop/tablet/mobile), fix defects, verify no inert controls, update docs + README, build verification.

## Testing

Extend existing `src/test/app-routing.test.tsx` pattern: route inventory (every route renders), key interactions (firewall rule create, incident status change, table search/sort), mock-auth flow. Run with `bunx vitest run`.

## Deliverables

Complete dual-workspace app, design system, reusable components, mock architecture, docs (`docs/UI_DESIGN_SYSTEM.md`, `UI_ARCHITECTURE.md`, `PAGE_INVENTORY.md`, `COMPONENT_GUIDE.md`), README with known limitations, automated tests, build verification.
