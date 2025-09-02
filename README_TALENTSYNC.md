TalentSync – Email Marketing + CRM Dashboard

Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (via @import)
- next-themes for dark mode
- Heroicons, Headless UI
- Chart.js via react-chartjs-2
- dnd-kit for drag-and-drop (builder)

Dev
1) Install deps: npm install
2) Run dev: npm run dev

Pages
- /              Dashboard widgets
- /campaigns     Campaign list + /campaigns/builder for drag-and-drop
- /contacts      Tabs + filters; /contacts/[id] details
- /analytics     Charts placeholders + ROI
- /automation    Workflow builder placeholder
- /settings      RBAC, integrations, GDPR placeholders

Notes
- Color palette uses CSS variables (primary #2563EB, background #fff, muted #F3F4F6). Toggle dark mode via the sun/moon button.
