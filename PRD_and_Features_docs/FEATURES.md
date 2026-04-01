# Features Document — Personal Finance & Expense Analytics App
**Version:** 1.0  
**Scope:** Detailed feature specifications, component breakdown, and acceptance criteria

---

## Feature Index

| ID | Feature | Priority | Type |
|---|---|---|---|
| F1 | Add / Edit / Delete Transactions | P0 | Core |
| F2 | Transaction List & Table View | P0 | Core |
| F3 | Search Transactions | P0 | Core |
| F4 | Multi-Filter System | P0 | Core |
| F5 | Sorting | P1 | Core |
| F6 | Budget Tracking | P0 | Core |
| F7 | Analytics Dashboard | P0 | Core |
| F8 | Recurring Expense Tracker | P1 | Core |
| F9 | AI Spending Insights | P1 | Extended |
| F10 | Multi-Currency Support | P1 | Extended |
| F11 | Financial News Feed | P2 | Extended |

---

## F1 — Transaction Management

### Description
The primary data entry point of the app. Users create, update, and delete financial transactions.

### Components
- `AddTransaction` page (`/transactions/new`)
- `EditTransaction` page (`/transactions/:id/edit`)
- `TransactionForm` component (shared between add and edit)

### Form Fields

| Field | Type | Validation |
|---|---|---|
| Title | text input | Required, min 2 chars, max 60 chars |
| Amount | number input | Required, > 0 |
| Category | select dropdown | Required |
| Transaction Type | radio (income / expense) | Required |
| Date | date picker | Required, not future date |
| Notes | textarea | Optional, max 200 chars |
| Recurring | checkbox toggle | Defaults to false |
| Currency | select (INR/USD/EUR/GBP/AED/SGD) | Defaults to INR |

### Categories

**Expense:** Food, Travel, Rent, Shopping, Entertainment, Health, Utilities, Subscriptions, Other  
**Income:** Salary, Freelance, Gift, Investment Return, Other

### Behavior
- Form built with `react-hook-form`
- Schema validation with `yup`
- On successful add: toast "Transaction added ✓" → redirect to `/transactions`
- On successful edit: toast "Transaction updated ✓" → redirect to `/transactions`
- On delete (from list): confirmation modal → toast "Deleted" → list refreshes
- Recurring toggle: adds a `recurring: true` flag and shows a repeat icon badge in list

### Acceptance Criteria
- [ ] Cannot submit with empty required fields
- [ ] Amount field rejects negative or zero values
- [ ] Date field rejects dates in the future
- [ ] Edit form pre-fills all existing values
- [ ] Delete shows a confirmation modal before removing
- [ ] Toast appears on every CRUD action

---

## F2 — Transaction List & Table View

### Description
Paginated, responsive display of all transactions. Works on mobile (card layout) and desktop (table layout).

### Component
- `TransactionList` (inside Transactions page)
- `TransactionCard` (mobile card view)
- `TransactionRow` (desktop table row)

### Display Fields
- Title
- Category (with colored badge)
- Amount (color-coded: green for income, red for expense)
- Type badge
- Date (formatted: "15 Mar 2026")
- Recurring icon (if applicable)
- Edit button | Delete button

### Pagination
- 15 transactions per page
- Previous / Next controls
- "Showing 1–15 of 42 transactions"

### Empty State
- Illustration + "No transactions yet. Add your first one!"
- CTA button to `/transactions/new`

### Acceptance Criteria
- [ ] All transactions from context render correctly
- [ ] Amount shown in INR (or converted to INR)
- [ ] Recurring transactions show a badge
- [ ] Edit navigates to `/transactions/:id/edit`
- [ ] Delete triggers confirmation, then removes from list
- [ ] Mobile view switches to card layout below 768px

---

## F3 — Search

### Description
Real-time search across transaction title and notes. Debounced for performance.

### Component
- `SearchBar` (inside Transactions page header)

### Behavior
- Input debounced by 300ms using `useDebounce` hook
- Searches across `title` and `notes` (case-insensitive)
- Updates transaction list live without page reload
- Clears with an X button inside the input
- Search result count shown: "12 results for 'zomato'"
- No results state: "No transactions match your search."

### Hook: `useDebounce`
```js
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### Acceptance Criteria
- [ ] Search triggers after 300ms of inactivity
- [ ] Matches found in both title and notes
- [ ] Case-insensitive matching
- [ ] Clear button resets results to full list
- [ ] Works in combination with active filters

---

## F4 — Multi-Filter System

### Description
A composable filter panel allowing users to narrow transactions by multiple dimensions simultaneously.

### Component
- `Filters` (collapsible sidebar panel or top filter bar)

### Filter Dimensions

| Filter | UI Control | Options |
|---|---|---|
| Category | Multi-select chips | All expense + income categories |
| Transaction Type | Toggle buttons | All / Income / Expense |
| Date Range | Two date pickers | From date → To date |
| Recurring | Toggle switch | Show recurring only |

### Behavior
- All filters apply with AND logic
- Active filter count badge shown on filter button
- "Clear All Filters" button resets everything
- Filters persist in URL query params (optional enhancement)
- Filter state stored in `useState` in Transactions page, passed down as props

### Acceptance Criteria
- [ ] Selecting Food + Travel shows only those categories
- [ ] Date range correctly excludes out-of-range transactions
- [ ] Recurring toggle shows only `recurring: true` items
- [ ] Multiple filters combine correctly (AND logic)
- [ ] Clearing resets to full unfiltered list
- [ ] Search + Filters work simultaneously

---

## F5 — Sorting

### Description
Sort the transaction list by key fields.

### Component
- `SortControls` dropdown (inside Transactions page)

### Sort Options
- Date: Newest first (default) | Oldest first
- Amount: High to low | Low to high
- Category: A–Z | Z–A

### Behavior
- Sort applied after filters and search
- Active sort shown in dropdown label
- Sort state in `useState`

### Acceptance Criteria
- [ ] Default sort is newest date first
- [ ] Amount sort uses numeric comparison (not string)
- [ ] Sorting works on filtered results, not full dataset

---

## F6 — Budget Tracking

### Description
Users define a monthly budget (total + optional per-category) and the app tracks usage in real time.

### Components
- `Budget` page (`/budget`)
- `BudgetCard` — total budget status card
- `CategoryBudgetBar` — per-category progress bar
- `useBudget` hook

### Budget Setup
- Set total monthly budget (₹ amount)
- Optional: set per-category sub-budgets
- Budget stored in `localStorage`, keyed by month (`budget-2026-03`)

### Display

**Total Budget Card:**
- Monthly Budget: ₹30,000
- Spent: ₹18,450
- Remaining: ₹11,550
- Progress bar (color-coded by %)

**Per-Category Breakdown:**
- Each category shows: Budget | Spent | Remaining | Mini progress bar
- Color coding: 
  - Green: < 70% used
  - Yellow: 70–90% used
  - Red: > 90% used (or over budget)

### Hook: `useBudget`
```js
function useBudget() {
  // Returns: { totalBudget, totalSpent, remaining, percentUsed, categoryBreakdown }
  // categoryBreakdown: [{ category, budget, spent, remaining, percent }]
}
```

### Acceptance Criteria
- [ ] Budget persists across sessions
- [ ] Totals update in real time as transactions are added
- [ ] Progress bars reflect correct percentages
- [ ] Over-budget categories shown in red
- [ ] Budget can be edited and reset for a new month

---

## F7 — Analytics Dashboard

### Description
Interactive charts giving users a visual overview of their financial patterns.

### Page: `/analytics`  
### Library: `recharts`

### Charts

**1. Spending by Category — Pie Chart**
- Data: Sum of expenses per category for selected month
- Interactive: hover shows category + amount + %
- Legend below chart

**2. Monthly Spending Trend — Line Chart**
- Data: Total expenses per month (last 6 months)
- X-axis: Month labels ("Oct", "Nov"...)
- Y-axis: ₹ amount
- Hover tooltip: month + total

**3. Income vs Expense — Bar Chart**
- Grouped bars per month (last 6 months)
- Two colors: income (green) and expense (red)
- Useful to see net monthly savings trend

**4. Daily Spending — Area Chart**
- X-axis: Day of selected month
- Y-axis: Cumulative or daily expense
- Toggle between current and previous month

### Metric Cards (Top of Analytics page)
| Card | Value |
|---|---|
| Total Income (this month) | ₹X |
| Total Expenses (this month) | ₹X |
| Net Balance | ₹X (+ or –) |
| Top Spending Category | Category + ₹amount |
| Biggest Transaction | Title + ₹amount |
| Avg Daily Spend | ₹X/day |

### Month Selector
Dropdown to view analytics for any past month with data.

### Acceptance Criteria
- [ ] Pie chart only shows categories with non-zero spending
- [ ] Line chart renders 6 months of data
- [ ] Bar chart shows correct income vs expense grouping
- [ ] Metric cards update when month changes
- [ ] Charts show empty state illustration when no data

---

## F8 — Recurring Expense Tracker

### Description
Dedicated view of all recurring transactions (subscriptions, rent, EMIs, etc.)

### Component
- `RecurringSection` (tab on Transactions page or section on Budget page)

### Behavior
- Pulls all `recurring: true` transactions
- Groups by category
- Shows total monthly recurring cost
- Highlights recurring items in the transaction list with a ⟳ badge
- Optional: show next expected date (same day next month)

### Display
- Summary card: "Total Recurring: ₹X/month across Y subscriptions"
- List: Name | Category | Amount | Frequency label (Monthly)

### Acceptance Criteria
- [ ] All recurring transactions surface correctly
- [ ] Total recurring cost computed accurately
- [ ] Badge visible on list items
- [ ] Removing recurring flag updates the tracker

---

## F9 (Extended) — AI Spending Insights

### Description
An AI-powered panel where users can ask questions about their finances in plain English.

### Component
- `AIInsights` page (`/ai`)
- `AIChatPanel` component with message thread UI

### Powered By
Anthropic Claude API — `claude-haiku-3-5`

### User Flows

**Auto Summary (on page load):**
Automatically generates: *"In March 2026, you spent ₹18,400. Your top category was Food at ₹5,200 (28%). You're 62% through your monthly budget."*

**Chat Q&A:**
Users type natural language questions:
- "Where am I overspending?"
- "What would happen if I cut Food to ₹4,000?"
- "How does this month compare to last month?"
- "What subscriptions should I reconsider?"

**Context Passed to AI:**
```
Transactions array (last 2 months), budget object, today's date, user's currency
```

### Implementation Notes
- API key stored in `.env` as `VITE_ANTHROPIC_API_KEY`
- Prompt includes full transaction context as JSON
- Streaming response rendered token by token
- Messages stored in component state (not persisted)
- Rate limit: max 10 AI queries per session (UI counter)

### Acceptance Criteria
- [ ] Auto-summary generates on page load
- [ ] User can type a question and receive a relevant response
- [ ] Responses reference actual transaction data, not generic advice
- [ ] Loading spinner shown while AI responds
- [ ] API errors shown as friendly message ("AI unavailable, try again")

---

## F10 (Extended) — Multi-Currency Support

### Description
Users can log transactions in foreign currencies; amounts auto-convert to INR.

### API
`https://api.exchangerate-api.com/v4/latest/INR`

### Supported Currencies
INR (default), USD, EUR, GBP, AED, SGD, JPY

### Behavior
- Currency dropdown added to transaction form (beside amount field)
- On form submit: fetch live rate → convert to INR → store both `amount` (INR) and `originalAmount` + `originalCurrency`
- Display: "₹4,200 (USD 50 @ 84.2)"
- Rates cached in `localStorage` with 1-hour TTL

### Hook: `useCurrency`
```js
function useCurrency() {
  // Returns: { convert(amount, fromCurrency), formatINR(amount), rates, loading }
}
```

### Acceptance Criteria
- [ ] USD amount correctly converts to INR using live rate
- [ ] Cached rate used if fetched within last hour
- [ ] Both original and INR amounts stored
- [ ] Analytics and budget use INR amount for all calculations
- [ ] Network error fallback: last known rate or error banner

---

## F11 (Extended) — Financial News Feed

### Description
A widget displaying 5 latest finance headlines, refreshed on Dashboard load.

### API
`https://newsapi.org/v2/top-headlines?category=business&country=in`

### Component
- `NewsFeed` (Dashboard sidebar widget)

### Behavior
- Shows 5 headlines with source name and publish time
- Each headline links to full article (new tab)
- Shows skeleton loader while fetching
- On error: "News unavailable" with retry button
- Filtered to India business news

### Acceptance Criteria
- [ ] 5 latest headlines display on Dashboard load
- [ ] Each item shows: headline, source, time ago
- [ ] Links open in new tab
- [ ] Skeleton loader shows during fetch
- [ ] Error state handled gracefully

---

## Custom Hooks Summary

| Hook | Purpose |
|---|---|
| `useTransactions()` | CRUD on transactions, filter/sort/search logic |
| `useBudget()` | Budget totals, per-category breakdown, % calculations |
| `useCurrency()` | Fetch and cache exchange rates, format and convert amounts |
| `useDebounce(value, delay)` | Delay state updates for search optimization |
| `useLocalStorage(key, initial)` | Sync any state to localStorage with auto-parse |
| `useAnalytics(transactions)` | Compute all derived analytics data for charts |

---

## Component Tree (Simplified)

```
App
├── Layout (Navbar + Sidebar)
│   ├── Dashboard
│   │   ├── MetricCards
│   │   ├── SpendingPieChart
│   │   ├── MonthlyTrendLine
│   │   └── NewsFeed
│   ├── Transactions
│   │   ├── SearchBar
│   │   ├── Filters
│   │   ├── SortControls
│   │   └── TransactionList → TransactionCard[]
│   ├── AddTransaction → TransactionForm
│   ├── EditTransaction → TransactionForm
│   ├── Budget
│   │   ├── BudgetCard
│   │   └── CategoryBudgetBar[]
│   ├── Analytics
│   │   ├── MetricCards
│   │   ├── PieChart
│   │   ├── BarChart
│   │   ├── LineChart
│   │   └── AreaChart
│   └── AIInsights
│       └── AIChatPanel
└── FinanceContext (wraps all)
```
