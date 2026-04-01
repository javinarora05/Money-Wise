import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown, MdAccountBalance, MdPieChart } from 'react-icons/md';
import { format, subMonths } from 'date-fns';

import { useFinance } from '../../context/FinanceContext';
import useAnalytics from '../../hooks/useAnalytics';
import useBudget from '../../hooks/useBudget';
import { getCurrentMonth, isInMonth } from '../../utils/dateHelpers';
import { formatINR } from '../../utils/currencyFormatter';

import MetricCard from '../../components/MetricCard/MetricCard';
import SpendingPieChart from '../../components/Charts/SpendingPieChart';
import MonthlyTrendLine from '../../components/Charts/MonthlyTrendLine';
import SavingsTips from '../../components/SavingsTips/SavingsTips';
import ComponentLoader from '../../components/UI/SkeletonLoader'; // For some components if needed
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import ConfirmModal from '../../components/UI/ConfirmModal';
import EmptyState from '../../components/UI/EmptyState';
import NewsFeed from '../../components/NewsFeed/NewsFeed';

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions } = useFinance();
  const currentMonth = getCurrentMonth();
  const analytics = useAnalytics(transactions, currentMonth);
  const budgetData = useBudget(currentMonth);

  const [deleteId, setDeleteId] = useState(null);
  const { deleteTransaction } = useFinance();

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      setDeleteId(null);
    }
  };

  // Recent transactions (latest 5)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [transactions]);

  // Monthly trend data (last 6 months)
  const trendData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const m = format(d, 'yyyy-MM');
      const label = format(d, 'MMM');
      const total = transactions
        .filter((t) => t.type === 'expense' && isInMonth(t.date, m))
        .reduce((sum, t) => sum + t.amount, 0);
      months.push({ month: label, total });
    }
    return months;
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back 👋</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          title="Budget Used"
          value={`${budgetData.percentUsed.toFixed(0)}%`}
          subtitle={`${formatINR(budgetData.totalSpent)} of ${formatINR(budgetData.totalBudget)}`}
          icon={MdPieChart}
          color="#059669"
        />
      </div>

      {/* Two-column layout: Left (charts), Right (transactions + tips) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left column — Charts stacked */}
        <div className="space-y-6">
          {/* Pie chart */}
          {Object.keys(analytics.byCategory).length > 0 ? (
            <SpendingPieChart data={analytics.byCategory} />
          ) : (
            <div className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Spending by Category</h3>
              <div className="flex items-center justify-center py-8">
                <EmptyState title="No expenses this month" description="Add expenses to see your breakdown." />
              </div>
            </div>
          )}

          {/* Monthly trend */}
          <MonthlyTrendLine data={trendData} />

          {/* News Feed */}
          <NewsFeed className="max-h-[420px] flex flex-col" />
        </div>

        {/* Right column — Recent Transactions + Savings Tips */}
        <div className="space-y-6">
          {/* Recent Transactions */}
          <div className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 max-h-[420px] flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Transactions</h3>
              <button
                onClick={() => navigate('/transactions')}
                className="text-xs text-[#059669] hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>
            {recentTransactions.length > 0 ? (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {recentTransactions.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  title="No transactions yet"
                  description="Add your first transaction!"
                  actionLabel="Add Transaction"
                  onAction={() => navigate('/transactions/new')}
                />
              </div>
            )}
          </div>

          {/* Savings Tips & Insights */}
          <SavingsTips analytics={analytics} />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction?"
      />
    </motion.div>
  );
};

export default Dashboard;
