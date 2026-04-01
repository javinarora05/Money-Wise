import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdLightbulb, MdTrendingDown, MdSavings, MdWarning, MdCheckCircle } from 'react-icons/md';

const allTips = [
  { icon: MdTrendingDown, text: 'Try the 50/30/20 rule — 50% needs, 30% wants, 20% savings.', color: '#059669' },
  { icon: MdSavings, text: 'Set up automatic transfers to a savings account on payday.', color: '#0ea5e9' },
  { icon: MdLightbulb, text: 'Review subscriptions monthly and cancel ones you don\'t use.', color: '#f59e0b' },
  { icon: MdCheckCircle, text: 'Use cash or a debit card instead of credit for daily purchases.', color: '#8b5cf6' },
  { icon: MdWarning, text: 'Build an emergency fund covering 3-6 months of expenses.', color: '#ef4444' },
  { icon: MdSavings, text: 'Cook meals at home — eating out is one of the biggest budget leaks.', color: '#059669' },
  { icon: MdLightbulb, text: 'Wait 24 hours before making any non-essential purchase over ₹1,000.', color: '#f59e0b' },
  { icon: MdTrendingDown, text: 'Track every expense — awareness alone reduces spending by 10-15%.', color: '#0ea5e9' },
];

const SavingsTips = ({ analytics, className = '' }) => {
  const insights = useMemo(() => {
    const items = [];

    // Dynamic insight based on spending
    if (analytics) {
      if (analytics.netBalance < 0) {
        items.push({
          icon: MdWarning,
          text: `You're overspending this month! Expenses exceed income by ₹${Math.abs(analytics.netBalance).toLocaleString('en-IN')}.`,
          color: '#ef4444',
          type: 'alert',
        });
      } else if (analytics.netBalance > 0) {
        const savingsRate = ((analytics.netBalance / analytics.totalIncome) * 100).toFixed(0);
        items.push({
          icon: MdCheckCircle,
          text: `Great job! You're saving ${savingsRate}% of your income this month.`,
          color: '#059669',
          type: 'success',
        });
      }

      if (analytics.topCategory) {
        items.push({
          icon: MdTrendingDown,
          text: `Your top spending category is "${analytics.topCategory.name}" at ₹${analytics.topCategory.amount.toLocaleString('en-IN')}. Consider setting a budget limit.`,
          color: '#f59e0b',
          type: 'insight',
        });
      }
    }

    // Fill with general tips (pick 3 random ones that haven't been added)
    const shuffled = [...allTips].sort(() => 0.5 - Math.random());
    const needed = Math.max(0, 4 - items.length);
    items.push(...shuffled.slice(0, needed).map(t => ({ ...t, type: 'tip' })));

    return items;
  }, [analytics]);

  return (
    <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 ${className}`}>
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <MdLightbulb className="text-lg text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Savings Tips & Insights</h3>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {insights.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-3 px-3 py-3 rounded-2xl transition-colors duration-200 ${
                tip.type === 'alert'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30'
                  : tip.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30'
                  : 'bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50'
              }`}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${tip.color}15` }}
              >
                <Icon className="text-sm" style={{ color: tip.color }} />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {tip.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsTips;
