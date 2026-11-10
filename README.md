# Student Daily Planner

> A focused, mobile-first planner for turning academic deadlines into consistent progress.

[![React](https://img.shields.io/badge/React-18-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![License: Not specified](https://img.shields.io/badge/license-not%20specified-lightgrey)](#license)

Student Daily Planner is a responsive single-page web app for organizing coursework, monitoring deadlines, and building consistent study habits. Tasks are prioritized automatically, saved locally in the browser, and surfaced through focused views for planning, studying, and progress review.

## Features

- **Task management** — Create, edit, complete, delete, reorder, and filter tasks.
- **Deadline intelligence** — Automatically group active tasks as urgent, normal, or safe based on due dates.
- **Recurring tasks** — Generate the next occurrence when a recurring task is completed.
- **Calendar planning** — Review tasks by date and keep upcoming deadlines visible.
- **Study tools** — Use the study timer, focus mode, breathing guidance, ambient sound controls, and volume settings.
- **Progress tracking** — View completion rates, weekly activity, streaks, completed-task history, and achievements.
- **Academic organization** — Group work by subject category, add notes, and review notifications.
- **Onboarding and preferences** — Guided first-run experience, resettable onboarding, settings, and light/dark theme support.
- **Responsive UI** — Touch-friendly interactions for phones, tablets, and desktop screens.
- **Offline-friendly storage** — Tasks, completion history, and onboarding state are persisted with `localStorage`.

> **Current scope:** This is a frontend prototype. The login and sign-up screens simulate authentication and do not connect to a backend or create real accounts. Planner data is stored per browser and is not synchronized between devices.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React 18, TypeScript |
| Build and development | Vite |
| Styling | Tailwind CSS, shadcn/ui, PostCSS |
| Components | Radix UI, Lucide React |
| Motion | Framer Motion |
| Routing | React Router |
| Forms and validation | React Hook Form, Zod |
| Data and utilities | React hooks, `localStorage`, date-fns |
| Quality | ESLint |

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Getting started

```bash
git clone https://github.com/pathumdeeptha9/Student-Daily-Planner.git
cd Student-Daily-Planner
npm install
npm run dev
```

Open the local URL printed by Vite, usually [`http://localhost:5173`](http://localhost:5173).

## Available scripts

```bash
npm run dev        # Start the Vite development server
npm run build      # Create a production build
npm run build:dev  # Create a development-mode build
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

## Project structure

```text
src/
├── components/       # Planner views and reusable UI components
│   └── ui/           # shadcn/ui and Radix-based primitives
├── hooks/            # Task, onboarding, responsive, and toast hooks
├── lib/              # Task rules and shared utilities
├── pages/            # Route-level screens
├── App.tsx           # Providers and route configuration
└── main.tsx          # Application entry point
```

The main route is `/`. The prototype authentication screen is available at `/auth`; unknown routes render the not-found page.

## Data persistence

The app does not require a database for local development. It stores data in the browser under these keys:

| Key | Purpose |
| --- | --- |
| `student_daily_planner_tasks` | Active and completed task records |
| `student_daily_planner_completed_history` | Completion events used for progress and streaks |
| `student_daily_planner_onboarding_complete` | Whether the onboarding flow has been completed |

Clearing site data resets the local planner and restores the sample tasks shown on first launch.

## Deployment

Build the static site with:

```bash
npm run build
```

Deploy the generated `dist/` directory to any static hosting provider. Because the app uses client-side routing, configure the provider to rewrite unknown routes to `index.html`.

## Development guidelines

- Use the `@/` alias for imports from `src`.
- Keep task behavior and calculations in `src/hooks/useTasks.ts` and `src/lib/taskUtils.ts`.
- Keep presentation concerns in components and route-level views.
- Run both `npm run lint` and `npm run build` before opening a pull request.

## Contributing

1. Create a feature branch.
2. Make a focused change that matches the existing patterns.
3. Run the lint and production build checks.
4. Open a pull request describing the user-facing impact.

## License

No license has been specified yet. Add a `LICENSE` file before distributing this project under an open-source license.
