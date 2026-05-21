# IslamQA Admin Dashboard

Admin panel for managing the [islamqa-clone](../islamqa-clone) content platform — questions, answers, articles, books, essential answers, knowledge files, and categories.

---

## Prerequisites

| Tool | Minimum version | Notes |
|------|----------------|-------|
| Node.js | 18.x | 20.x or 22.x recommended |
| npm | 9.x | comes with Node |
| Git | any | for cloning |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Login Credentials (Development)

The app uses a fake backend (no real API calls). Two accounts are pre-configured:

| Role   | Email                   | Password   |
|--------|-------------------------|------------|
| Admin  | admin@islamqa.info      | admin123   |
| Editor | editor@islamqa.info     | editor123  |

> These credentials only exist in the mock layer (`src/helpers/fake-backend.ts`). They are not real accounts and have no network access.

---

## Available Scripts

```bash
npm run dev       # Start dev server with HMR on http://localhost:5173
npm run build     # Type-check then compile for production (output: dist/)
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint across all .ts/.tsx files
```

---

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build tool | Vite | 4.x |
| Styling | Tailwind CSS | 3.x + SCSS |
| UI components | FrostUI, Headless UI | — |
| State management | Redux Toolkit + Redux Saga | 1.9.x |
| Forms | React Hook Form + Yup | 7.x / 1.x |
| HTTP (mocked) | Axios + axios-mock-adapter | 0.21 / 1.19 |
| Alerts | SweetAlert2 | 11.x |
| Routing | React Router v6 | 6.x |

---

## Folder Structure

```
src/
├── assets/
│   └── scss/
│       ├── app.scss              # Entry point: variables, Tailwind, structure, components, plugins
│       ├── icons.scss            # Icon font imports (MingCute, Material Symbols)
│       ├── config/               # SCSS variables and theme config
│       ├── structure/            # Sidebar and topbar layout styles
│       ├── components/           # Buttons, cards, forms, reboot, helpers, print
│       ├── plugins/              # Third-party plugin styles (charts, editors, tables, etc.)
│       └── icons/                # Icon font partials
├── components/                   # Shared UI components (FormInput, PageBreadcrumb, etc.)
├── constants/
│   └── menu.ts                   # Sidebar navigation structure
├── helpers/
│   ├── fake-backend.ts           # Mock API (axios-mock-adapter)
│   └── api/
│       ├── apiCore.ts            # Auth helpers, session management
│       └── auth.ts               # Login / logout API wrappers
├── layouts/                      # Vertical layout, Topbar, LeftSideBar, Footer
├── pages/
│   ├── auth/                     # Login, Register
│   ├── dashboard/                # Overview with stats and recent activity
│   ├── questions/                # List, Create, Edit
│   ├── articles/                 # List, Create, Edit
│   ├── books/                    # List, Create, Edit
│   ├── faqs/                     # List, Create, Edit
│   ├── categories/               # List, Create, Edit
│   ├── corrections/              # List
│   ├── knowledge-files/          # List, Upload
│   ├── site-pages/               # List, Edit
│   ├── user-questions/           # List
│   └── settings/                 # General settings, Pages
├── redux/                        # Store, reducers, sagas
├── routes/
│   ├── index.tsx                 # All route definitions (lazy-loaded)
│   ├── Routes.tsx                # Router component
│   └── PrivateRoute.tsx          # Auth guard
└── types/
    └── islamqa.ts                # Shared TypeScript interfaces
```

---

## Connecting to a Real Backend

The project currently runs entirely on a client-side mock. To wire it up to a real API:

1. **Remove the fake backend** — delete the `configureFakeBackend()` call in `src/index.tsx` and remove `src/helpers/fake-backend.ts`.

2. **Set the base URL** — create a `.env` file in the project root:

   ```env
   VITE_API_BASE_URL=https://api.islamqa.info/v1
   ```

   Then update `src/helpers/api/apiCore.ts`:

   ```ts
   const API_URL = import.meta.env.VITE_API_BASE_URL;
   ```

3. **Replace mock data** — each List/Create/Edit page currently uses hardcoded arrays. Replace those with `useEffect` + axios calls, or wire in Redux Saga actions that hit the real endpoints.

4. **Update auth** — `src/helpers/fake-backend.ts` returns a hardcoded JWT. Replace `src/helpers/api/auth.ts` to POST to your real `/auth/login` endpoint and store the returned token.

---

## Theme Customization

### Primary color

The green (`#2e7d32`) is defined in two places — change both to stay in sync:

- `tailwind.config.js` → `theme.extend.colors.primary`
- `src/assets/scss/app.scss` → `--islamqa-primary`

### Dark mode

Dark mode is driven by a `data-mode="dark"` attribute on `<html>`. Toggle it via the theme button in the top-right corner of the UI, or programmatically:

```ts
document.documentElement.setAttribute('data-mode', 'dark');
```

---

## Common Issues

### `'vite' is not recognized`

Run `npm install` before `npm run dev`. Node modules are not committed to the repo.

### Port 5173 already in use

```bash
npm run dev -- --port 5174
```

### TypeScript errors on `yupResolver`

Some Yup schema shapes require an explicit `as any` cast on the resolver due to strict generic inference. This is a known issue with `@hookform/resolvers` + Yup v1. It does not affect runtime behaviour.
