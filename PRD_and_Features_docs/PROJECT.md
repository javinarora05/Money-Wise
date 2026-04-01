# Project.md — Personal Finance & Expense Analytics App

> A production-grade React application for tracking expenses, managing budgets, visualizing financial behavior, and getting AI-powered spending insights.

---

## What This Project Is

This is a full-featured **Personal Finance & Expense Analytics App** built in React. It goes well beyond a basic CRUD app — it integrates three real external APIs, implements a full analytics dashboard with interactive charts, and includes an AI assistant that reads your actual transaction data and answers questions about your spending in plain English.

This project was designed as both a **college assignment submission** and a **portfolio piece** that demonstrates real-world React skills: Context API, custom hooks, form validation, routing, API integration, data visualization, and clean component architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| State Management | Context API + useReducer |
| Form Handling | react-hook-form + yup |
| Charts | recharts |
| Styling | Tailwind CSS |
| Animation | framer-motion |
| Icons | react-icons |
| Notifications | react-toastify |
| Date Utilities | date-fns |
| ID Generation | uuid |
| HTTP Client | axios / fetch |
| Persistence | localStorage |
| AI | Anthropic Claude API |
| Currency | ExchangeRate-API |
| News | NewsAPI |

---

## Project Structure

```
finance-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── TransactionCard/
│   │   │   ├── TransactionCard.jsx
│   │   │   └── TransactionCard.css
│   │   ├── Charts/
│   │   │   ├── SpendingPieChart.jsx
│   │   │   ├── MonthlyTrendLine.jsx
│   │   │   ├── IncomeExpenseBar.jsx
│   │   │   └── DailyAreaChart.jsx
│   │   ├── SearchBar/
│   │   │   └── SearchBar.jsx
│   │   ├── Filters/
│   │   │   └── Filters.jsx
│   │   ├── BudgetCard/
│   │   │   ├── BudgetCard.jsx
│   │   │   └── CategoryBudgetBar.jsx
│   │   ├── NewsFeed/
│   │   │   └── NewsFeed.jsx
│   │   ├── MetricCard/
│   │   │   └── MetricCard.jsx
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── UI/
│   │       ├── SkeletonLoader.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ConfirmModal.jsx
│   │       └── ProgressBar.jsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Transactions/
│   │   │   └── Transactions.jsx
│   │   ├── AddTransaction/
│   │   │   └── AddTransaction.jsx
│   │   ├── EditTransaction/
│   │   │   └── EditTransaction.jsx
│   │   ├── Budget/
│   │   │   └── Budget.jsx
│   │   ├── Analytics/
│   │   │   └── Analytics.jsx
│   │   └── AIInsights/
│   │       └── AIInsights.jsx
│   ├── context/
│   │   └── FinanceContext.jsx
│   ├── hooks/
│   │   ├── useTransactions.js
│   │   ├── useBudget.js
│   │   ├── useCurrency.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useAnalytics.js
│   ├── services/
│   │   ├── claudeService.js
│   │   ├── currencyService.js
│   │   └── newsService.js
│   ├── utils/
│   │   ├── currencyFormatter.js
│   │   ├── dateHelpers.js
│   │   └── categoryColors.js
│   ├── data/
│   │   └── sampleTransactions.js    ← seed data for demo
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys for: Anthropic, ExchangeRate-API, NewsAPI (see API_DOC.md)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/finance-app.git
cd finance-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# 4. Start the dev server
npm run dev
```

Visit `http://localhost:5173`

### Environment Variables

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
VITE_EXCHANGERATE_API_KEY=your_key_here
VITE_NEWS_API_KEY=your_key_here
```

---

## npm Packages

```bash
npm install react-router-dom axios react-icons react-toastify \
            react-hook-form yup recharts date-fns uuid framer-motion \
            @hookform/resolvers tailwindcss @tailwindcss/vite
```

---

## Core Architecture

### Global State — FinanceContext

All transaction and budget data lives in a single context, available everywhere in the app.

```jsx
// context/FinanceContext.jsx
const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [budget, setBudget] = useLocalStorage("budget", { monthlyTotal: 30000, categories: {} });

  const addTransaction = (tx) => setTransactions(prev => [tx, ...prev]);
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));
  const updateTransaction = (id, updated) =>
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, budget, setBudget }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
```

### Routing — App.jsx

```jsx
<BrowserRouter>
  <FinanceProvider>
    <ToastContainer />
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/new" element={<AddTransaction />} />
        <Route path="/transactions/:id/edit" element={<EditTransaction />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai" element={<AIInsights />} />
      </Routes>
    </Layout>
  </FinanceProvider>
</BrowserRouter>
```

### Data Persistence

All data stored in `localStorage` via the `useLocalStorage` custom hook. No backend required.

```js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (val) => {
    const toStore = typeof val === "function" ? val(value) : val;
    setValue(toStore);
    localStorage.setItem(key, JSON.stringify(toStore));
  };

  return [value, setStoredValue];
}
```

---

## Key Implementation Details

### Form Validation Pattern (react-hook-form + yup)

```js
// Yup schema
const transactionSchema = yup.object({
  title: yup.string().min(2).max(60).required("Title is required"),
  amount: yup.number().positive("Must be positive").required("Amount is required"),
  category: yup.string().required("Category is required"),
  type: yup.string().oneOf(["income", "expense"]).required(),
  date: yup.date().max(new Date(), "Cannot be a future date").required(),
  notes: yup.string().max(200).optional(),
});

// In component
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(transactionSchema),
  defaultValues: existingTransaction || {},
});
```

### Filtering Logic (useTransactions hook)

```js
function useTransactions() {
  const { transactions } = useFinance();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ categories: [], type: "all", dateFrom: null, dateTo: null, recurring: false });
  const [sort, setSort] = useState({ field: "date", direction: "desc" });

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const matchSearch = !debouncedSearch ||
          t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.notes?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchCategory = filters.categories.length === 0 || filters.categories.includes(t.category);
        const matchType = filters.type === "all" || t.type === filters.type;
        const matchDate = (!filters.dateFrom || new Date(t.date) >= new Date(filters.dateFrom)) &&
                          (!filters.dateTo || new Date(t.date) <= new Date(filters.dateTo));
        const matchRecurring = !filters.recurring || t.recurring;
        return matchSearch && matchCategory && matchType && matchDate && matchRecurring;
      })
      .sort((a, b) => {
        const dir = sort.direction === "asc" ? 1 : -1;
        if (sort.field === "date") return dir * (new Date(a.date) - new Date(b.date));
        if (sort.field === "amount") return dir * (a.amount - b.amount);
        if (sort.field === "category") return dir * a.category.localeCompare(b.category);
        return 0;
      });
  }, [transactions, debouncedSearch, filters, sort]);

  return { filtered, search, setSearch, filters, setFilters, sort, setSort };
}
```

### Analytics Computation (useAnalytics hook)

```js
function useAnalytics(transactions, month) {
  return useMemo(() => {
    const monthTxs = transactions.filter(t => t.date.startsWith(month));
    const expenses = monthTxs.filter(t => t.type === "expense");
    const incomes = monthTxs.filter(t => t.type === "income");

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    const byCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    return { totalExpense, totalIncome, netBalance: totalIncome - totalExpense, byCategory, topCategory };
  }, [transactions, month]);
}
```

---

## Sample Data (for demo/testing)

A `sampleTransactions.js` file with 20+ pre-built transactions across all categories and months. Used to populate the app on first load if `localStorage` is empty.

```js
// data/sampleTransactions.js
export const sampleTransactions = [
  { id: "1", title: "Zomato Dinner", amount: 480, category: "Food", type: "expense", date: "2026-03-28", notes: "", recurring: false, originalCurrency: "INR" },
  { id: "2", title: "Netflix", amount: 649, category: "Subscriptions", type: "expense", date: "2026-03-01", notes: "", recurring: true, originalCurrency: "INR" },
  { id: "3", title: "Internship Stipend", amount: 15000, category: "Salary", type: "income", date: "2026-03-05", notes: "March stipend", recurring: true, originalCurrency: "INR" },
  // ... 17 more entries
];
```

---

## Pages At a Glance

### `/dashboard`
- Total income / expense / balance for current month
- Pie chart: spending by category
- Line chart: 6-month expense trend
- News feed (right sidebar)
- Quick-add transaction button

### `/transactions`
- Full transaction list with search bar
- Filter panel (category, type, date range, recurring)
- Sort dropdown
- Paginated (15 per page)
- Edit / Delete per row

### `/transactions/new` and `/transactions/:id/edit`
- Full validated form
- Currency selector
- Recurring toggle
- Success toast + redirect

### `/budget`
- Set / update monthly budget
- Total budget vs spent card
- Per-category progress bars with color coding

### `/analytics`
- Month selector dropdown
- 4 recharts visualizations
- 6 metric summary cards

### `/ai`
- Auto-generated summary on load
- Chat interface for Q&A
- Context: full transaction history + budget

---

## Evaluation Checklist

| Criteria | How It's Met |
|---|---|
| Feature Completeness (25%) | 8 core features + 3 extended (AI, currency, news) |
| React Architecture (25%) | Context API, 6 custom hooks, 5 pages, clean folder structure |
| State Management (20%) | Global context + useMemo derived state + localStorage persistence |
| UI Design (15%) | Tailwind CSS, framer-motion animations, responsive, dark mode support |
| Code Quality (15%) | Modular services, reusable components, consistent naming, commented hooks |

---

## What Makes This Stand Out

1. **Real AI integration** — not just charts, but a Claude-powered assistant that reads your actual data and answers questions intelligently.

2. **Live currency conversion** — actual API call to convert foreign transactions to INR with 1-hour caching. Practical and realistic.

3. **Full validation** — `react-hook-form` + `yup` with proper field-level error messages and UX feedback.

4. **Production-grade error handling** — every API call has loading, success, error, and empty states. No silent failures.

5. **Performance-conscious** — `useMemo` for derived analytics, `useDebounce` for search, session/localStorage caching for APIs.

6. **Scalable architecture** — clean separation of concerns: services, hooks, context, and components are all independent and testable.

---

## Future Enhancements (post-submission ideas)

- Export transactions to CSV
- Dark mode toggle
- Monthly email report (using EmailJS)
- PWA support for mobile install
- Backend integration with Supabase for persistence across devices
- Google OAuth login for multi-device sync
