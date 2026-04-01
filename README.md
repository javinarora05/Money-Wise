# Fintrack — Personal Finance & Expense Analytics App

> Track every rupee. Understand every pattern. Take control of your money.

**Live Demo:** [personal-finance-expense-analytics-blue.vercel.app](https://personal-finance-expense-analytics-blue.vercel.app/dashboard)

---

## What is this?

Fintrack is a production-grade personal finance app built in React. It lets you record income and expenses, set monthly budgets, visualize your spending patterns through interactive charts, and get AI-powered insights about your financial behavior — all without a backend or database. Everything runs in the browser.

Built as a college React project, but designed and architected like a real consumer finance product.

---

## Features

### Core
- **Transaction management** — add, edit, and delete income/expense transactions with full form validation
- **Smart categorization** — 9 expense categories (Food, Travel, Rent, Shopping, Entertainment, Health, Utilities, Subscriptions, Other) and 5 income categories
- **Search & filter** — real-time search across title and notes, filter by category, type, date range, and recurring status
- **Sorting** — sort by date, amount, or category in either direction
- **Budget tracking** — set a monthly total budget and per-category sub-budgets with color-coded progress bars
- **Recurring expense tracker** — mark subscriptions and fixed costs as recurring, see total recurring spend at a glance
- **Analytics dashboard** — pie chart, line chart, bar chart, and area chart powered by Recharts

### Extended
- **AI spending insights** — powered by the Anthropic Claude API; get a plain-English summary of your spending and ask questions like "where am I overspending?" or "what should I cut to save ₹5,000?"
- **Multi-currency support** — log transactions in USD, EUR, GBP, AED, SGD, or INR; amounts auto-convert to INR using live exchange rates
- **Financial news feed** — latest India business headlines on the dashboard, pulled from NewsAPI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| State | Context API + custom hooks |
| Forms | react-hook-form + yup |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Notifications | react-toastify |
| Date utilities | date-fns |
| IDs | uuid |
| AI | Anthropic Claude API |
| Currency | ExchangeRate-API |
| News | NewsAPI |
| Deployment | Vercel |

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Key metrics, charts, recent transactions, news feed |
| `/transactions` | Transactions | Full list with search, filter, sort, edit, delete |
| `/transactions/new` | Add Transaction | Validated form with currency selector |
| `/transactions/:id/edit` | Edit Transaction | Pre-filled edit form |
| `/budget` | Budget | Total + per-category budget tracking |
| `/analytics` | Analytics | Deep-dive charts with month selector |
| `/ai` | AI Insights | Claude-powered spending Q&A |

---

## Getting Started

### Prerequisites
- Node.js 18+
- API keys for Anthropic, ExchangeRate-API, and NewsAPI (all have free tiers)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/fintrack.git
cd fintrack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Start the dev server
npm run dev
```

Visit `http://localhost:5173`

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
VITE_EXCHANGERATE_API_KEY=your_key_here
VITE_NEWS_API_KEY=your_key_here
```

**Get your keys:**
- Anthropic: [console.anthropic.com](https://console.anthropic.com)
- ExchangeRate-API: [exchangerate-api.com](https://app.exchangerate-api.com/sign-up) — 1,500 free requests/month
- NewsAPI: [newsapi.org/register](https://newsapi.org/register) — 100 free requests/day

> **Note:** Never commit your `.env` file. It's already in `.gitignore`.

---

## Architecture

### No backend required
All data is persisted in `localStorage`. Transactions, budgets, and cached API responses live in the browser — no database, no server, no auth.

### Global state
A single `FinanceContext` wraps the app and exposes transactions and budget to every component. State is synced to `localStorage` via a custom `useLocalStorage` hook.

### Custom hooks
| Hook | Purpose |
|---|---|
| `useLocalStorage` | Sync any state to localStorage with auto-parse |
| `useDebounce` | 300ms debounce for the search input |
| `useTransactions` | Filter, sort, and search logic with `useMemo` |
| `useBudget` | Total + per-category budget calculations |
| `useCurrency` | Fetch and cache live exchange rates |
| `useAnalytics` | All derived chart data for a given month |

### API caching
- Exchange rates cached in `localStorage` with a 1-hour TTL
- News headlines cached in `sessionStorage` per tab session (to protect the 100 req/day limit)
- AI queries are not cached — limited to 10 per session via a UI counter

---

## Project Structure

```
src/
├── components/
│   ├── Charts/          # Recharts wrappers (pie, line, bar, area)
│   ├── BudgetCard/      # Budget total card + category progress bars
│   ├── Layout/          # Navbar
│   ├── UI/              # SkeletonLoader, EmptyState, ConfirmModal, ProgressBar
│   └── ...              # SearchBar, Filters, TransactionCard, NewsFeed, MetricCard
├── pages/               # One folder per route
├── context/             # FinanceContext.jsx
├── hooks/               # All custom hooks
├── services/            # claudeService, currencyService, newsService
├── utils/               # currencyFormatter, dateHelpers, categoryColors
├── data/                # sampleTransactions.js (25 seed transactions)
├── App.jsx
└── main.jsx
```

---

## Deployment

Deployed on Vercel. The `vercel.json` at the project root handles client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This is required — without it, directly visiting any route (like `/dashboard`) returns a 404.

To deploy your own instance:

```bash
npm install -g vercel
vercel
```

Then add your environment variables in the Vercel dashboard under Project Settings → Environment Variables.

---

## Evaluation Criteria (College Submission)

| Criteria | Weight | Implementation |
|---|---|---|
| Feature completeness | 25% | 8 core features + 3 extended (AI, currency, news) |
| React architecture | 25% | Context API, 6 custom hooks, clean folder structure |
| State management | 20% | Global context, `useMemo` derived state, localStorage |
| UI design | 15% | Tailwind CSS, Framer Motion, fully responsive |
| Code quality | 15% | Modular services, reusable components, consistent patterns |

---

## License

MIT — free to use, modify, and distribute.