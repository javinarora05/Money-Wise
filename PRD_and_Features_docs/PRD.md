# PRD — Personal Finance & Expense Analytics App
**Version:** 1.0  
**Author:** Shiven  
**Status:** Draft  
**Last Updated:** March 2026

---

## 1. Product Overview

### Vision
A production-grade Personal Finance & Expense Analytics App that helps students and young professionals in India gain real-time clarity over their spending, budgets, and financial behavior — built entirely in React.

### Elevator Pitch
Track every rupee. Understand every pattern. Take control of your money — one transaction at a time.

---

## 2. Problem Statement

Students and early-career professionals in India transact across multiple channels — UPI, credit cards, subscriptions, and cash. There is no unified, visual, and intelligent interface to:

- See where money is going across categories
- Set and enforce monthly budgets
- Detect recurring expenses and subscriptions
- Get AI-powered spending insights in plain English
- Convert and view expenses in multiple currencies

Manual spreadsheets exist but lack real-time filtering, analytics, visual dashboards, and intelligent summaries.

---

## 3. Goals

### Primary Goals
1. Record, categorize, and manage income and expense transactions
2. Visualize spending behavior via interactive charts
3. Track and enforce monthly category-level budgets
4. Support recurring expense detection and highlighting
5. Deliver AI-powered natural language summaries of financial behavior

### Secondary Goals
- Enable multi-currency expense logging via live exchange rates
- Surface live financial news relevant to the user's behavior
- Build a clean, scalable React architecture as a portfolio-grade project

### Non-Goals (Out of Scope)
- Bank account integration / real UPI sync
- Multi-user / household budgeting
- Investments or stock portfolio tracking

---

## 4. Target Users

| Segment | Description |
|---|---|
| College Students | Managing pocket money, hostel costs, subscriptions |
| Early-Career Professionals | First salary, managing rent, food, EMIs |
| Freelancers | Irregular income, expense tracking for tax purposes |

### User Pain Points
- "I don't know where my ₹20,000 went this month."
- "I forgot I was paying for 3 subscriptions."
- "I can't tell if I'm overspending on food or travel."
- "My budget is a WhatsApp note that I never update."

---

## 5. Core Features

### F1 — Transaction Management
Users can add, edit, and delete income/expense transactions.

**Transaction Fields:**
- Title (string, required)
- Amount (number, required, > 0)
- Category (enum, required)
- Type: `income` | `expense`
- Date (date picker, required)
- Notes (string, optional)
- Recurring (boolean toggle)
- Currency (string, defaults to INR)

**Expense Categories:** Food, Travel, Rent, Shopping, Entertainment, Health, Utilities, Subscriptions, Other  
**Income Categories:** Salary, Freelance, Gift, Investment Return, Other

**Validation:** `react-hook-form` + `yup`  
**Feedback:** Toast notifications via `react-toastify` on add/edit/delete

---

### F2 — Transaction List & Table View
A paginated, responsive table/list showing all transactions.

Each row displays: Title | Category | Amount | Type | Date | Recurring badge | Actions (Edit / Delete)

---

### F3 — Search
Real-time full-text search across `title` and `notes` fields.  
Debounced with `useDebounce` hook (300ms delay).

---

### F4 — Filtering
Multi-filter sidebar/panel supporting:
- Category (multi-select)
- Transaction Type (income / expense / all)
- Date Range (from–to date picker)
- Recurring only (toggle)

Filters are composable (AND logic across all active filters).

---

### F5 — Sorting
Sort the transaction list by:
- Date (newest / oldest)
- Amount (high to low / low to high)
- Category (A–Z)

---

### F6 — Budget Tracking
Users set a monthly budget (total or per-category).

Display:
- Monthly budget amount
- Total spent so far
- Remaining budget
- % used (with color-coded progress bar: green < 70%, yellow 70–90%, red > 90%)
- Per-category breakdown with mini progress bars

---

### F7 — Analytics Dashboard
Visual financial insights using `recharts`:

| Chart | Type | Data |
|---|---|---|
| Spending by Category | Pie Chart | Category totals for selected month |
| Monthly Trend | Line Chart | Total spending per month (last 6 months) |
| Income vs Expense | Bar Chart | Monthly comparison |
| Daily Spending | Area Chart | Day-by-day expense curve |

Key metric cards:
- Total Income (this month)
- Total Expenses (this month)
- Net Balance
- Top Spending Category
- Biggest Single Transaction

---

### F8 — Recurring Expense Tracker
Users mark transactions as recurring on creation/edit.

Features:
- Dedicated "Recurring" filter tab
- Highlighted badge on recurring transactions
- Summary card: total recurring cost per month
- Visual list of all active recurring expenses

---

### F9 (Extended) — AI Spending Insights ✨
**API Used:** Anthropic Claude API (claude-haiku-3-5 via direct API call from the app)

A dedicated "Ask AI" panel where users can:
- Get a plain-English summary: *"You spent ₹12,400 on food this month — 40% more than last month."*
- Ask natural language questions: *"Where am I overspending?"* or *"What can I cut to save ₹5,000?"*
- Receive budget recommendations based on spending history

Implementation: Transactions and budget data are passed as context in the prompt. Responses stream into the UI.

---

### F10 (Extended) — Multi-Currency Support 💱
**API Used:** ExchangeRate-API (`https://api.exchangerate-api.com/v4/latest/INR`)

- Users can log transactions in USD, EUR, GBP, AED, SGD, INR
- Amounts auto-converted to INR using live rates on save
- Currency selector in transaction form
- Currency rates cached for 1 hour in `localStorage`

---

### F11 (Extended) — Financial News Feed 📰
**API Used:** NewsAPI (`https://newsapi.org`)

- Sidebar widget on Dashboard showing 5 latest finance/economy headlines
- Filtered by keywords: "India economy", "personal finance", "RBI", "inflation"
- Links open in new tab
- Refreshed on Dashboard load

---

## 6. Pages & Routing

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` or `/dashboard` | Key metrics + charts + news feed |
| Transactions | `/transactions` | Full transaction list with search/filter/sort |
| Add Transaction | `/transactions/new` | Add transaction form |
| Edit Transaction | `/transactions/:id/edit` | Pre-filled edit form |
| Budget | `/budget` | Budget setup and tracking |
| Analytics | `/analytics` | Deep-dive charts |
| AI Insights | `/ai` | AI chat panel for spending Q&A |

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Responsiveness | Mobile-first; works on 375px–1440px viewports |
| Performance | Debounced search, memoized selectors, lazy-loaded chart pages |
| Persistence | `localStorage` for transactions and budget (no backend required) |
| Loading States | Skeleton loaders on all data-dependent views |
| Empty States | Illustrated empty states on all list/chart views |
| Accessibility | Semantic HTML, aria-labels on interactive elements |
| Error Handling | API error banners with retry options |

---

## 8. Data Model

### Transaction
```json
{
  "id": "uuid-v4",
  "title": "Zomato dinner",
  "amount": 450,
  "originalAmount": 450,
  "originalCurrency": "INR",
  "category": "Food",
  "type": "expense",
  "date": "2026-03-15",
  "notes": "Late night order",
  "recurring": false,
  "createdAt": "2026-03-15T20:30:00Z"
}
```

### Budget
```json
{
  "monthlyTotal": 30000,
  "categories": {
    "Food": 8000,
    "Travel": 3000,
    "Rent": 10000,
    "Shopping": 3000,
    "Entertainment": 2000,
    "Health": 2000,
    "Utilities": 1500,
    "Subscriptions": 500
  },
  "month": "2026-03"
}
```

---

## 9. Evaluation Criteria

| Criteria | Weight | Notes |
|---|---|---|
| Feature Completeness | 25% | All 8 core + 3 extended features |
| React Architecture | 25% | Context, custom hooks, folder structure |
| State Management | 20% | Context API, derived state, memoization |
| UI / UX Design | 15% | Responsive, polished, consistent |
| Code Quality | 15% | Clean, readable, commented |

---

## 10. Timeline (Suggested)

| Week | Milestone |
|---|---|
| Week 1 | Project setup, routing, Context API, localStorage |
| Week 2 | Transaction CRUD, form validation, list + search/filter |
| Week 3 | Budget page, Analytics charts, Recurring tracker |
| Week 4 | API integrations (Currency + News + AI), polish, testing |
