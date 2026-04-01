import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { isInMonth, getCurrentMonth } from '../utils/dateHelpers';

/**
 * Hook for budget analysis and category breakdown.
 */
const useBudget = (month) => {
  const { transactions, budget } = useFinance();
  const targetMonth = month || budget.month || getCurrentMonth();

  const analysis = useMemo(() => {
    // Get all expenses for the target month
    const monthExpenses = transactions.filter(
      (t) => t.type === 'expense' && isInMonth(t.date, targetMonth)
    );

    const totalSpent = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = budget.monthlyTotal || 0;
    const remaining = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Category breakdown
    const categorySpending = {};
    monthExpenses.forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + t.amount;
    });

    const categoryBreakdown = Object.entries(budget.categories || {}).map(
      ([category, budgetAmount]) => {
        const spent = categorySpending[category] || 0;
        const catRemaining = budgetAmount - spent;
        const catPercent =
          budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
        return {
          category,
          budget: budgetAmount,
          spent,
          remaining: catRemaining,
          percentUsed: catPercent,
        };
      }
    );

    return {
      totalBudget,
      totalSpent,
      remaining,
      percentUsed,
      categoryBreakdown,
    };
  }, [transactions, budget, targetMonth]);

  return analysis;
};

export default useBudget;
