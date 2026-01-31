# Job Search Analytics Dashboard

A comprehensive, data-driven dashboard tracking job search metrics and interview performance. Built to demonstrate technical skills and provide transparency into the job search process.

**Website**: [Bob Baxter Job Search Dashboard](https://bob-baxter-job-search-dashboard.vercel.app/)

![Image of dashboard site](./Screenshot_2026-01-31.png)

## Overview

This project is a real-time analytics dashboard that visualizes job application data, interview metrics, and hiring pipeline statistics. It was built during a period of active job searching to track progress, identify patterns, and answer the common interview question: "What have you been doing with your time?"

The dashboard pulls data from a Google Sheets spreadsheet and presents it through an interactive, responsive web interface with multiple chart types and real-time calculations.

## Key Features

### Metrics Tracked

- **Application Statistics**:
  - Total applications
  - Breakdown by status (applied, ghosted, not selected, etc.)
- **Interview Analytics**:
  - Companies interviewed count and response rates
  - Total interview sessions and hours invested
  - Interview volume by stage (recruiter screen, tech interviews, panels, etc.)
- **Performance Metrics**:
  - Average interview cycle length
  - Auto-rejection response times
  - Company ghost rate
  - Estimated time spent on ghosted applications
- **Temporal Analysis**: Application and outcome trends over time

### Visualizations

- **Pie Charts**: Application status breakdown
- **Area Charts**: Application trends over time
- **Bar Charts**: Interview volume and time allocation by stage
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

### Frontend

- **Next.js 16** (App Router) - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization library
- **Radix UI** - Accessible component primitives

### Backend & Data

- **Next.js API Routes** - Server-side data processing
- **Google Sheets API** - Data source integration
- **Google Auth Library** - Service account authentication

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Architecture Highlights

### Data Processing Pipeline

The application follows a clean separation of concerns:

1. **Data Source**: Google Sheets spreadsheet containing raw application data
2. **API Layer** (`app/api/jobs/route.ts`): Fetches and aggregates data
3. **Data Filters** (`lib/data-filters/`): Pure functions for data transformation and calculation
4. **Components**: Reusable, composable React components for visualization

### Key Technical Decisions

- **Server-Side Data Fetching**: Uses Next.js App Router for efficient data loading
- **Modular Data Processing**: Each metric calculation is isolated in its own function for maintainability
- **Type Safety**: Full TypeScript coverage with custom types for application data
- **Responsive Design**: Container queries and responsive breakpoints for optimal viewing on all devices
- **Performance**: Memoization and efficient re-rendering strategies

## Project Structure

```
apps-2025/
├── app/
│   ├── api/jobs/          # API route for data fetching
│   ├── page.tsx           # Main dashboard page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui style)
│   ├── bar-chart-mixed.tsx
│   ├── chart-area-interactive.tsx
│   ├── pie-chart-card.tsx
│   └── top-section-card.tsx
├── lib/
│   ├── data-filters/      # Data transformation functions
│   │   ├── application-data.ts
│   │   ├── application-sessions.ts
│   │   ├── average-interview-cycle-length.ts
│   │   ├── company-ghost-rate.ts
│   │   └── ...
│   └── utils.ts           # Utility functions
└── type.d.ts              # TypeScript type definitions
```

## How to Run the Project on Your Own Machine

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Google Cloud service account credentials (for Google Sheets API access)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd apps-2025
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up Google Sheets API credentials:
   - Create a Google Cloud service account
   - Download the JSON credentials file
   - Extract the `client_email` and `private_key` from the JSON file
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```bash
     cp .env.example .env
     ```

**Important Notes:**

- The `private_key` should include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- Replace `\n` with actual newlines in the private key, or keep them as `\n` (the code handles both)
- Share your Google Sheet with the service account email address
- The `.env` file is already in `.gitignore` and will not be committed to version control

1. Update the Google Sheet ID in `app/api/jobs/route.ts`:

```typescript
const doc = new GoogleSpreadsheet('YOUR_SHEET_ID', jwt);
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables for Production

For production deployments (e.g., Vercel), set the environment variables in your deployment platform's settings:

- `CLIENT_EMAIL`: Your Google Cloud service account email
- `PRIVATE_KEY`: Your service account private key (with newlines preserved or as `\n`)

### Building for Production

```bash
npm run build
npm start
```

## Contact

**Bob Baxter**

- LinkedIn: [bob-e-baxter](https://www.linkedin.com/in/bob-e-baxter/)
- GitHub: [bobbybaxter](https://github.com/bobbybaxter)
