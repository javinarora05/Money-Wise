import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdSavings, MdEdit } from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import useBudget from '../../hooks/useBudget';
import { getCurrentMonth, formatMonth, isInMonth } from '../../utils/dateHelpers';
import { formatINR } from '../../utils/currencyFormatter';
import { EXPENSE_CATEGORIES } from '../../utils/categoryColors';

import BudgetCard from '../../components/BudgetCard/BudgetCard';
import CategoryBudgetBar from '../../components/BudgetCard/CategoryBudgetBar';

const Budget = () => {
  const { transactions, budget, setBudget } = useFinance();
  const currentMonth = getCurrentMonth();
  const budgetAnalysis = useBudget(currentMonth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    monthlyTotal: budget.monthlyTotal,
    categories: { ...budget.categories },
  });

  const handleSave = () => {
    setBudget({
      monthlyTotal: Number(formData.monthlyTotal),
      categories: Object.fromEntries(
        Object.entries(formData.categories).map(([k, v]) => [k, Number(v)])
      ),
      month: currentMonth,
    });
    setIsEditing(false);
    toast.success('Budget updated');
  };

  // Recurring expenses for this month
  const recurringExpenses = transactions.filter(
    (t) => t.recurring && t.type === 'expense' && isInMonth(t.date, currentMonth)
  );
  const totalRecurring = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Budget</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{formatMonth(currentMonth)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Budget overview */}
        <div className="space-y-6">
          <BudgetCard
            totalBudget={budgetAnalysis.totalBudget}
            totalSpent={budgetAnalysis.totalSpent}
            remaining={budgetAnalysis.remaining}
            percentUsed={budgetAnalysis.percentUsed}
          />

          {/* Category breakdown */}
          <div className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Category Breakdown</h3>
            <div>
              {budgetAnalysis.categoryBreakdown.map((cat) => (
                <CategoryBudgetBar
                  key={cat.category}
                  category={cat.category}
                  budget={cat.budget}
                  spent={cat.spent}
                  remaining={cat.remaining}
                  percentUsed={cat.percentUsed}
                />
              ))}
            </div>
          </div>

          {/* Recurring expenses */}
          <div className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <MdSavings className="text-lg text-[#3C3489]" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recurring Expenses</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-3">
              Total: {formatINR(totalRecurring)}/month across {recurringExpenses.length} item{recurringExpenses.length !== 1 ? 's' : ''}
            </p>
            {recurringExpenses.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">No recurring expenses this month.</p>
            ) : (
              <div className="space-y-2">
                {recurringExpenses.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EEEDFE] text-[#3C3489]">
                        ↻
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{tx.title}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatINR(tx.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Set budget form */}
        <div>
          <div className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isEditing ? 'Edit Budget' : 'Budget Settings'}
              </h3>
              {!isEditing && (
                <button
                  onClick={() => {
                    setFormData({
                      monthlyTotal: budget.monthlyTotal,
                      categories: { ...budget.categories },
                    });
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1 text-xs text-[#059669] hover:underline cursor-pointer"
                >
                  <MdEdit className="text-sm" /> Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Total (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyTotal}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, monthlyTotal: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category Budgets
                  </label>
                  <div className="space-y-2">
                    {EXPENSE_CATEGORIES.filter((c) => c !== 'Other').map((cat) => (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 w-28">{cat}</span>
                        <input
                          type="number"
                          value={formData.categories[cat] || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              categories: { ...prev.categories, [cat]: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                          placeholder="₹0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 dark:bg-slate-900 transition-colors duration-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSave}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2.5 bg-[#059669] text-white rounded-[1.5rem] text-sm font-semibold hover:bg-[#065f46] transition-colors cursor-pointer"
                  >
                    Save Budget
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Monthly Total</span>
                  <span className="text-sm font-semibold">{formatINR(budget.monthlyTotal)}</span>
                </div>
                {Object.entries(budget.categories).map(([cat, amount]) => (
                  <div key={cat} className="flex justify-between py-1.5">
                    <span className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{cat}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{formatINR(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Budget;
