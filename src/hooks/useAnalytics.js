import { useMemo } from 'react';
import { isInMonth } from '../utils/dateHelpers';

/**
 * Hook for analytics data computation.
 * @param {Array} transactions - all transactions
 * @param {string} month - target month in YYYY-MM format
 */
const useAnalytics = (transactions, month) => {
  return useMemo(() => {
    const monthTxns = transactions.filter((t) => isInMonth(t.date, month));

    const expenses = monthTxns.filter((t) => t.type === 'expense');
    const incomes = monthTxns.filter((t) => t.type === 'income');

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    // Spending by category
    const byCategory = {};
    expenses.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

    // Top category
    const topCategory = Object.entries(byCategory).sort(
      ([, a], [, b]) => b - a
    )[0];

    // Biggest single transaction
    const biggestTx =
      expenses.length > 0
        ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max))
        : null;

    // Average daily spend
    const uniqueDays = new Set(expenses.map((t) => t.date));
    const avgDailySpend =
      uniqueDays.size > 0 ? totalExpense / uniqueDays.size : 0;

    return {
      totalExpense,
      totalIncome,
      netBalance,
      byCategory,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      biggestTx,
      avgDailySpend,
    };
  }, [transactions, month]);
};

export default useAnalytics;
