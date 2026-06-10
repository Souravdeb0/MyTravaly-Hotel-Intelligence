# MyTravaly Hotel Intelligence

A responsive hotel booking analytics dashboard that transforms live booking data into a clear operational view of revenue, demand, occupancy, conversion, and upcoming stays.

Built as a frontend internship assignment with a strong focus on React, API integration, state management, responsive UI, accessibility, and production-quality user experience.

## Links

- **Live Demo:** [mytravaly-hotel-intelligence.vercel.app](https://mytravaly-hotel-intelligence.vercel.app)
- **GitHub Repository:** [Souravdeb0/MyTravaly-Hotel-Intelligence](https://github.com/Souravdeb0/MyTravaly-Hotel-Intelligence)

## Dashboard Preview

The dashboard includes:

- A live overview of booking and revenue performance
- Interactive revenue and booking trend charts
- Occupancy and conversion indicators
- A searchable and filterable guest booking ledger
- Responsive desktop tables and mobile booking cards
- Loading, refreshing, empty, retry, and API error states

## Features

### Analytics Overview

- Total bookings and confirmed stays
- Total revenue for the selected period
- Average booking value
- Active confirmed and pending reservations
- Occupancy and conversion rates
- Monthly revenue and booking trends

### Booking Management

- Search by guest name, hotel, or booking ID
- Filter by booking status
- Filter by payment status
- Filter by hotel and room type
- Sort by check-in date, booking value, guest, or hotel
- Browse bookings in compact six-record pages
- Reset all filters in one action

Filtering and sorting are performed client-side, so interactions are immediate and do not trigger unnecessary API requests.

### UI and UX

- Responsive layouts for desktop, tablet, and mobile
- Desktop booking table and mobile-first booking cards
- Sticky navigation for long booking lists
- Skeleton loading experience
- Coordinated refresh feedback and live update timestamps
- Clear empty and recoverable error states
- Smooth, restrained motion with reduced-motion support
- Keyboard-accessible native controls and visible focus states
- Tabular numerals for scannable financial and booking data

## Tech Stack

| Technology | Responsibility |
| --- | --- |
| React 19 | Component-based user interface |
| TypeScript | Domain models and compile-time safety |
| Vite | Development server and production build |
| TanStack Query | Remote state, caching, retries, and refreshes |
| Recharts | Responsive revenue and booking visualizations |
| Lucide React | Consistent interface icons |
| Vitest | Unit tests for filtering and formatting logic |
| ESLint | Code quality and React hook validation |

## API Integration

**Base URL**

```text
https://mt-task.onrender.com
```

| Endpoint | Parameters | Usage |
| --- | --- | --- |
| `GET /api/bookings` | `days` | Upcoming booking records |
| `GET /api/metrics` | `days` | Aggregated booking and performance metrics |
| `GET /api/trends` | `months` | Monthly bookings, revenue, and average room rate |

Example requests:

```text
GET /api/bookings?days=30
GET /api/metrics?days=30
GET /api/trends?months=6
```

### Dynamic API Behavior

The provided API intentionally generates randomized data on every request. As a result, booking records, aggregate metrics, and trend values can differ between calls.

The dashboard treats each endpoint as an independent live operational signal rather than falsely implying that separate randomized responses reconcile exactly. Pressing **Refresh** invalidates all active queries together and updates the dashboard as one coordinated interaction.

## Architecture

The application separates responsibilities into small, focused layers:

```text
src/
├── components/       Reusable dashboard and booking UI
├── lib/
│   ├── api.ts        Typed API request functions
│   ├── bookings.ts   Client-side filtering and sorting
│   └── format.ts     Currency, date, and display helpers
├── App.tsx           Query orchestration and page composition
├── types.ts          Shared domain and API types
└── main.tsx          React and TanStack Query setup
```

### State Management

- **TanStack Query** owns API data, loading states, retries, caching, and refresh behavior.
- **Local React state** owns the selected analytics periods and booking filters.
- **Derived values** such as filtered bookings and filter options are calculated from source state rather than duplicated.
- **`useDeferredValue`** keeps booking search responsive while users type.

This approach keeps remote and interface state clearly separated without introducing unnecessary global state.

### Error and Loading Strategy

- Initial requests display a dashboard-shaped skeleton.
- Render cold starts are handled through query retries and a clear retry screen.
- Refreshing preserves existing data while showing progress instead of blanking the dashboard.
- Empty filter results display a dedicated state with recovery guidance.
- Request functions reject unsuccessful HTTP and API responses with user-readable errors.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
git clone https://github.com/Souravdeb0/MyTravaly-Hotel-Intelligence.git
cd MyTravaly-Hotel-Intelligence
npm install
```

Create a local environment file if you need to override the default API:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Environment Variables

| Variable | Required | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No | `https://mt-task.onrender.com` |

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Validate TypeScript without emitting files |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |

## Testing

The unit suite covers:

- Case-insensitive booking search
- Combined booking and payment filters
- Booking value sorting
- Default check-in sorting
- Indian currency formatting
- Date formatting
- Guest initials

Run all quality gates:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment

The project includes `vercel.json` and can be deployed directly to Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use the detected Vite configuration.
4. Optionally configure `VITE_API_BASE_URL`.
5. Deploy and add the generated URL to the **Links** section.

The application is entirely client-side and does not require a database or custom backend.

## Design Decisions

- The visual palette is derived from the provided MyTravaly `MT` logo.
- IBM Plex Sans establishes the analytical hierarchy, while DM Sans keeps controls and dense data readable.
- Uniform tabular numerals improve alignment across currency, dates, KPIs, and table values.
- Coral is reserved for brand identity and high-value interaction feedback.
- Warm neutral surfaces reduce visual fatigue without sacrificing contrast.
- Motion is used to communicate loading, refresh, and hierarchy rather than as decoration.

## Assignment Requirements Covered

- React.js implementation
- Integration with all three documented API endpoints
- Clear remote and local state management
- Meaningful charts and analytics
- Client-side booking filters
- Responsive desktop, tablet, and mobile layouts
- Loading and error states
- Documented architectural decisions
- Vercel-ready deployment configuration
