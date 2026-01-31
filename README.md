# Job Search Analytics Dashboard

A comprehensive, data-driven dashboard tracking job search metrics and interview performance. Built to demonstrate technical skills and provide transparency into the job search process.

## Overview

This project is a real-time analytics dashboard that visualizes job application data, interview metrics, and hiring pipeline statistics. It was built during a period of active job searching to track progress, identify patterns, and answer the common interview question: "What have you been doing with your time?"

The dashboard pulls data from a Google Sheets spreadsheet and presents it through an interactive, responsive web interface with multiple chart types and real-time calculations.

## Key Features

### Metrics Tracked

- **Application Statistics**: Total applications, breakdown by status (applied, ghosted, not selected, etc.)
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
- **Salary Analysis**: Salary range breakdowns by level (Junior, Mid-level, Senior)

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
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

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

## Getting Started

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
   - Place it in the project root as `google-sheets-service-account.json`
   - Share your Google Sheet with the service account email

4. Update the Google Sheet ID in `app/api/jobs/route.ts`:

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

### Building for Production

```bash
npm run build
npm start
```

## Key Metrics & Calculations

The dashboard calculates several meaningful metrics:

- **Response Rate**: Percentage of applications that resulted in interviews
- **Ghost Rate**: Percentage of applications that received no response
- **Interview Cycle Length**: Average days from application to final decision
- **Time Investment**: Calculated hours spent on interviews and applications
- **Salary Analysis**: Quartile analysis of salary ranges by experience level

## What This Demonstrates

### Technical Skills

- **Full-Stack Development**: End-to-end application from data source to UI
- **Data Processing**: Complex calculations and aggregations from raw data
- **API Integration**: Google Sheets API integration with authentication
- **Data Visualization**: Multiple chart types with interactive features
- **Responsive Design**: Mobile-first approach with container queries
- **Type Safety**: Comprehensive TypeScript usage
- **Code Organization**: Modular, maintainable architecture

### Professional Skills

- **Problem-Solving**: Built a solution to track and analyze job search data
- **Attention to Detail**: Comprehensive metrics and data validation
- **User Experience**: Intuitive interface with clear visualizations
- **Documentation**: Clean code with clear structure

## Future Enhancements

Potential improvements for the project:

- [ ] Export functionality for reports
- [ ] Date range filtering
- [ ] Additional chart types (scatter plots, heatmaps)
- [ ] Comparison views (month-over-month, year-over-year)
- [ ] Data export to CSV/PDF
- [ ] Automated data validation and error handling
- [ ] Dark mode support

## License

This project is private and for demonstration purposes.

## Contact

**Bob Baxter**

- LinkedIn: [bob-e-baxter](https://www.linkedin.com/in/bob-e-baxter/)
- GitHub: [bobbybaxter](https://github.com/bobbybaxter)

---

_Built with Next.js, React, TypeScript, and Recharts_
