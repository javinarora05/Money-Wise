# API Documentation — Personal Finance & Expense Analytics App
**Version:** 1.0  
**Scope:** All external APIs used, integration patterns, error handling, and environment setup

---

## API Overview

| API | Purpose | Required | Auth |
|---|---|---|---|
| Anthropic Claude API | AI spending insights & Q&A | Yes (F9) | API Key |
| ExchangeRate-API | Live currency conversion | Yes (F10) | API Key (free) |
| NewsAPI | Financial news feed | Optional (F11) | API Key (free) |

---

## Environment Setup

Create a `.env` file at the project root:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
VITE_EXCHANGERATE_API_KEY=your_exchangerate_key
VITE_NEWS_API_KEY=your_newsapi_key
```

Access in code:
```js
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
```

> **Security Note:** These keys will be exposed in client-side bundles. For production, proxy API calls through a backend. For this project (portfolio/college), client-side usage is acceptable — never push `.env` to GitHub.

Add to `.gitignore`:
```
.env
.env.local
```

---

## API 1 — Anthropic Claude API

### Overview
Powers the AI Spending Insights page. Sends the user's transaction history and budget as context, then generates financial summaries or answers user questions in plain English.

### Endpoint
```
POST https://api.anthropic.com/v1/messages
```

### Model
```
claude-haiku-3-5-20251001
```
(Fast and cost-effective — ideal for interactive Q&A)

### Headers
```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_ANTHROPIC_KEY",
  "anthropic-version": "2023-06-01"
}
```

### Request Body Structure
```json
{
  "model": "claude-haiku-3-5-20251001",
  "max_tokens": 1024,
  "system": "You are a personal finance advisor. Analyze the user's transaction data and provide clear, actionable insights in simple English. Always reference actual numbers from the data. Format responses in 2-4 short paragraphs.",
  "messages": [
    {
      "role": "user",
      "content": "Here is my financial data for March 2026:\n\nTransactions: [...]\n\nMonthly Budget: ₹30,000\n\nQuestion: Where am I overspending?"
    }
  ]
}
```

### Full Integration Example

```js
// services/claudeService.js

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export async function getAIInsight(transactions, budget, userQuestion) {
  const transactionSummary = transactions
    .filter(t => t.type === "expense")
    .map(t => `${t.date}: ${t.title} — ₹${t.amount} [${t.category}]`)
    .join("\n");

  const categoryTotals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const prompt = `
Here is my expense data:

TRANSACTIONS:
${transactionSummary}

CATEGORY TOTALS:
${JSON.stringify(categoryTotals, null, 2)}

MONTHLY BUDGET: ₹${budget.monthlyTotal}

MY QUESTION: ${userQuestion}
  `.trim();

  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-3-5-20251001",
      max_tokens: 1024,
      system: "You are a personal finance advisor. Be concise, specific, and always reference actual numbers from the data provided.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "AI request failed");
  }

  const data = await response.json();
  return data.content[0].text;
}
```

### Auto-Summary on Page Load

```js
// Called with userQuestion = "Give me a brief summary of my finances this month."
const summary = await getAIInsight(currentMonthTransactions, budget, 
  "Give me a brief 3-sentence summary of my spending this month, highlight what's good and what needs attention."
);
```

### Response Structure
```json
{
  "id": "msg_01...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "In March 2026, you spent ₹18,400 out of your ₹30,000 budget (61%). Your biggest expense was Food at ₹5,200, which is 28% of total spending — slightly high. The good news: you're well under budget in Travel (₹800 vs ₹3,000 allocated). Consider reviewing your ₹1,200 in Subscriptions — that's 3 recurring charges you may want to audit."
    }
  ],
  "model": "claude-haiku-3-5-20251001",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 450, "output_tokens": 112 }
}
```

### Error Handling

| Status | Cause | Handling |
|---|---|---|
| 401 | Invalid API key | "AI unavailable: check your API key." |
| 429 | Rate limit exceeded | "Too many requests. Wait 60s and retry." |
| 500 | Anthropic server error | "AI service down. Try again shortly." |
| Network error | No internet | "Check your connection and retry." |

```js
try {
  const result = await getAIInsight(transactions, budget, question);
  setAIResponse(result);
} catch (err) {
  setError(err.message || "Something went wrong with the AI service.");
}
```

### Cost Estimate
- claude-haiku-3-5: ~$0.001 per query (very cheap)
- 100 queries/day ≈ $0.10/day — negligible for a college project

---

## API 2 — ExchangeRate-API

### Overview
Provides live currency exchange rates relative to INR. Used to convert foreign-currency transactions into INR for unified analytics.

### Free Plan
- 1,500 requests/month
- Updated daily
- No credit card required

### Get API Key
Sign up at: `https://app.exchangerate-api.com/sign-up`

### Endpoint
```
GET https://v6.exchangerate-api.com/v6/{API_KEY}/latest/INR
```

### Response Structure
```json
{
  "result": "success",
  "base_code": "INR",
  "conversion_rates": {
    "INR": 1,
    "USD": 0.01189,
    "EUR": 0.01098,
    "GBP": 0.00940,
    "AED": 0.04366,
    "SGD": 0.01604,
    "JPY": 1.79
  }
}
```

### Full Integration Example

```js
// services/currencyService.js

const BASE_URL = "https://v6.exchangerate-api.com/v6";
const CACHE_KEY = "exchange_rates_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

export async function getExchangeRates() {
  // Check cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { rates, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return rates; // Return cached rates if fresh
    }
  }

  // Fetch live rates
  const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
  const response = await fetch(`${BASE_URL}/${apiKey}/latest/INR`);

  if (!response.ok) throw new Error("Failed to fetch exchange rates");

  const data = await response.json();
  const rates = data.conversion_rates;

  // Cache the result
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    rates,
    timestamp: Date.now(),
  }));

  return rates;
}

export function convertToINR(amount, fromCurrency, rates) {
  if (fromCurrency === "INR") return amount;
  // rates[currency] gives how many units = 1 INR
  // So 1 USD = 1/rates.USD INR
  const inrPerUnit = 1 / rates[fromCurrency];
  return Math.round(amount * inrPerUnit);
}
```

### Usage in Transaction Form

```js
// Inside TransactionForm.jsx on submit
const handleSubmit = async (formData) => {
  let finalAmount = formData.amount;

  if (formData.currency !== "INR") {
    const rates = await getExchangeRates();
    finalAmount = convertToINR(formData.amount, formData.currency, rates);
  }

  const transaction = {
    ...formData,
    id: uuidv4(),
    amount: finalAmount,              // Always INR
    originalAmount: formData.amount,  // Original value
    originalCurrency: formData.currency,
    createdAt: new Date().toISOString(),
  };

  addTransaction(transaction);
};
```

### Display Example
```
₹4,200   (USD 50 @ ₹84.00)
```

### Error Handling

| Scenario | Handling |
|---|---|
| API key invalid | Show error banner on transaction form |
| Rate limit hit | Use last cached rate with "Rates may be outdated" notice |
| Network error | Use hardcoded fallback rates, show warning toast |

**Fallback rates (hardcoded as last resort):**
```js
const FALLBACK_RATES = {
  USD: 0.01189,  // 1 INR = 0.01189 USD → 1 USD ≈ ₹84
  EUR: 0.01098,
  GBP: 0.00940,
  AED: 0.04366,
  SGD: 0.01604,
};
```

---

## API 3 — NewsAPI

### Overview
Fetches latest India business/finance headlines for the Dashboard news widget.

### Free Plan
- 100 requests/day
- Developer use only (cannot be deployed publicly without paid plan)

### Get API Key
Sign up at: `https://newsapi.org/register`

### Endpoint
```
GET https://newsapi.org/v2/top-headlines
  ?category=business
  &country=in
  &pageSize=5
  &apiKey={YOUR_KEY}
```

### Response Structure
```json
{
  "status": "ok",
  "totalResults": 35,
  "articles": [
    {
      "source": { "id": null, "name": "Economic Times" },
      "title": "RBI holds repo rate steady at 6.5% amid global uncertainty",
      "description": "The Reserve Bank of India's monetary policy committee...",
      "url": "https://economictimes.indiatimes.com/...",
      "publishedAt": "2026-03-30T09:15:00Z",
      "urlToImage": "https://..."
    }
  ]
}
```

### Full Integration Example

```js
// services/newsService.js

export async function fetchFinanceNews() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?category=business&country=in&pageSize=5&apiKey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch news");

  const data = await response.json();

  return data.articles.map(article => ({
    title: article.title,
    source: article.source.name,
    url: article.url,
    publishedAt: article.publishedAt,
    description: article.description,
  }));
}
```

### Usage in NewsFeed Component

```js
// components/NewsFeed.jsx
const [news, setNews] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchFinanceNews()
    .then(setNews)
    .catch(err => setError("Could not load news."))
    .finally(() => setLoading(false));
}, []);
```

### Display Format
```
📰  RBI holds repo rate steady at 6.5%
    Economic Times · 2 hours ago
```

### Error Handling

| Scenario | Handling |
|---|---|
| Key invalid / expired | Hide news widget, show "News unavailable" |
| Rate limit (100/day) | Cache today's fetch in sessionStorage |
| Network error | Show "Could not load news. Retry?" button |

**Session caching to preserve rate limit:**
```js
const SESSION_KEY = "news_cache";

export async function fetchFinanceNewsCached() {
  const cached = sessionStorage.getItem(SESSION_KEY);
  if (cached) return JSON.parse(cached);

  const articles = await fetchFinanceNews();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(articles));
  return articles;
}
```

---

## Services Folder Structure

```
src/
└── services/
    ├── claudeService.js      # Anthropic AI integration
    ├── currencyService.js    # ExchangeRate-API + caching
    └── newsService.js        # NewsAPI + session caching
```

---

## API Rate Limit Summary

| API | Free Limit | Strategy |
|---|---|---|
| Anthropic Claude | Pay-per-use (~$0.001/call) | UI limit of 10 queries/session |
| ExchangeRate-API | 1,500 req/month | Cache in localStorage with 1hr TTL |
| NewsAPI | 100 req/day | Cache in sessionStorage per tab session |

---

## Error Handling Pattern (Shared)

All API calls follow this pattern across the app:

```js
// Generic API wrapper
async function apiCall(fn, setLoading, setError) {
  setLoading(true);
  setError(null);
  try {
    return await fn();
  } catch (err) {
    setError(err.message || "An error occurred. Please try again.");
    return null;
  } finally {
    setLoading(false);
  }
}
```

UI states for all API-dependent components:
1. **Loading** → Skeleton loader / spinner
2. **Success** → Render data
3. **Error** → Friendly error message + retry button
4. **Empty** → Illustrated empty state
