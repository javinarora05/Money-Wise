import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subMonths } from 'date-fns';
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdCategory,
  MdReceipt,
  MdCalendarToday,
} from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import useAnalytics from '../../hooks/useAnalytics';
import { getCurrentMonth, getLastNMonths, formatMonth, isInMonth } from '../../utils/dateHelpers';
import { formatINR } from '../../utils/currencyFormatter';

import MetricCard from '../../components/MetricCard/MetricCard';
import SpendingPieChart from '../../components/Charts/SpendingPieChart';
import MonthlyTrendLine from '../../components/Charts/MonthlyTrendLine';
import IncomeExpenseBar from '../../components/Charts/IncomeExpenseBar';
import DailyAreaChart from '../../components/Charts/DailyAreaChart';
import EmptyState from '../../components/UI/EmptyState';

const Analytics = () => {
  const { transactions } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const analytics = useAnalytics(transactions, selectedMonth);

  const availableMonths = useMemo(() => getLastNMonths(6, getCurrentMonth()), []);

  // Monthly trend data (last 6 months)
  const trendData = useMemo(() => {
    return availableMonths.map((m) => {
      const label = format(new Date(m + '-01'), 'MMM');
      const total = transactions
        .filter((t) => t.type === 'expense' && isInMonth(t.date, m))
        .reduce((sum, t) => sum + t.amount, 0);
      return { month: label, total };
    });
  }, [transactions, availableMonths]);

  // Income vs Expense bar data
  const barData = useMemo(() => {
    return availableMonths.map((m) => {
      const label = format(new Date(m + '-01'), 'MMM');
      const income = transactions
        .filter((t) => t.type === 'income' && isInMonth(t.date, m))
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions
        .filter((t) => t.type === 'expense' && isInMonth(t.date, m))
        .reduce((sum, t) => sum + t.amount, 0);
      return { month: label, income, expense };
    });
  }, [transactions, availableMonths]);

  // Daily spending for selected month
  const dailyData = useMemo(() => {
    const monthTxns = transactions.filter(
      (t) => t.type === 'expense' && isInMonth(t.date, selectedMonth)
    );
    const days = {};
    monthTxns.forEach((t) => {
      const day = t.date.split('-')[2];
      days[day] = (days[day] || 0) + t.amount;
    });
    // Fill missing days with 0
    const daysInMonth = new Date(
      Number(selectedMonth.split('-')[0]),
      Number(selectedMonth.split('-')[1]),
      0
    ).getDate();
    const result = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = String(i).padStart(2, '0');
      result.push({ day, amount: days[day] || 0 });
    }
    return result;
  }, [transactions, selectedMonth]);

  const hasData = transactions.some((t) => isInMonth(t.date, selectedMonth));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header with month selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Financial insights</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-800 dark:bg-slate-800 transition-colors duration-200 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
          id="analytics-month-selector"
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </div>

      {!hasData ? (
        <EmptyState
          title="No data for this month"
          description="Add transactions to see analytics."
        />
      ) : (
        <>
          {/* 6 Metric cards — 3+3 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <MetricCard
              title="Total Income"
              value={formatINR(analytics.totalIncome)}
              icon={MdTrendingUp}
              color="#27AE60"
            />
            <MetricCard
              title="Total Expenses"
              value={formatINR(analytics.totalExpense)}
              icon={MdTrendingDown}
              color="#E74C3C"
            />
            <MetricCard
              title="Net Balance"
              value={formatINR(analytics.netBalance)}
              icon={MdAccountBalance}
              color={analytics.netBalance >= 0 ? '#27AE60' : '#E74C3C'}
            />
            <MetricCard
              title="Top Category"
              value={analytics.topCategory ? analytics.topCategory.name : '—'}
              subtitle={analytics.topCategory ? formatINR(analytics.topCategory.amount) : undefined}
              icon={MdCategory}
              color="#8B5CF6"
            />
            <MetricCard
              title="Biggest Transaction"
              value={analytics.biggestTx ? analytics.biggestTx.title : '—'}
              subtitle={analytics.biggestTx ? formatINR(analytics.biggestTx.amount) : undefined}
              icon={MdReceipt}
              color="#F59E0B"
            />
            <MetricCard
              title="Avg Daily Spend"
              value={formatINR(Math.round(analytics.avgDailySpend))}
              subtitle="per day"
              icon={MdCalendarToday}
              color="#059669"
            />
          </div>

          {/* 2x2 chart grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingPieChart data={analytics.byCategory} />
            <MonthlyTrendLine data={trendData} />
            <IncomeExpenseBar data={barData} />
            <DailyAreaChart data={dailyData} />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Analytics;
