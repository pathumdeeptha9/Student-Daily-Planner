# Student Daily Planner

> A focused, mobile-friendly planner for turning academic deadlines into consistent progress.

Student Daily Planner is a React + TypeScript web app for organizing coursework, tracking deadlines, and building better study habits. Tasks are automatically grouped by urgency, persisted in the browser, and paired with calendar, focus, and progress tools.

## Highlights

- **Smart task management** — Create tasks with descriptions, due dates, categories, and recurrence.
- **Automatic priority indicators** — Urgent, normal, and safe states are calculated from each task's deadline.
- **Calendar planning** — Browse monthly deadlines and inspect tasks for a selected day.
- **Focus mode** — Use a 25-minute focus timer with breathing guidance, ambient sound options, and volume controls.
- **Progress tracking** — View completion rate, active tasks, weekly activity, completed-task history, and streaks.
- **Flexible organization** — Filter and reorder tasks, use subject categories, add notes, and review achievements.
- **Responsive experience** — Designed for touch-first use on phones and larger screens, with light and dark themes.
- **Offline-friendly persistence** — Tasks and completion history are stored in `localStorage`; no backend is required to run the app locally.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 18, TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Interaction | Framer Motion, Lucide React |
| Routing | React Router |
| State and persistence | React hooks and browser `localStorage` |
| Validation and utilities | ESLint, date-fns, Zod |

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/pathumdeeptha9/Student-Daily-Planner.git
cd Student-Daily-Planner
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

### Available scripts

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run build:dev  # Create a development-mode build
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

## How it works

The main planner experience is assembled in `src/pages/Index.tsx`. Reusable views and UI components live under `src/components`, while task creation, completion history, recurrence, filtering, and progress calculations are managed by `src/hooks/useTasks.ts`.

Tasks are initially populated with sample academic items for a usable first-run experience. After that, task data and completion history are saved under these browser storage keys:

- `student_daily_planner_tasks`
- `student_daily_planner_completed_history`

Clearing browser storage resets the local planner data.

## Project structure

```text
src/
├── components/   # Planner views and reusable UI components
├── hooks/        # Task and onboarding state
├── lib/          # Task utilities and shared helpers
├── pages/        # Application routes
├── App.tsx       # Providers and route configuration
└── main.tsx      # Application entry point
```

## Development notes

- Use the existing path alias (`@/`) for imports from `src`.
- Keep task behavior in the task hook and presentation logic in components.
- Run `npm run lint` and `npm run build` before submitting changes.

## Deployment

Build the app with:

```bash
npm run build
```

The generated `dist/` directory can be deployed to any static hosting provider that supports single-page applications. Configure the host to fall back to `index.html` for client-side routes.

## License

No license has been specified yet. Add a `LICENSE` file before distributing the project under an open-source license.
