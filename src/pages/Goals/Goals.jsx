import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
  MdFlag,
  MdAdd,
  MdClose,
  MdDelete,
  MdEdit,
  MdSavings,
} from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/currencyFormatter';
import ConfirmModal from '../../components/UI/ConfirmModal';

const GOAL_COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', targetAmount: '', savedAmount: '', color: '#059669' });

  const openAdd = () => {
    setEditingGoal(null);
    setForm({ name: '', targetAmount: '', savedAmount: '', color: GOAL_COLORS[goals.length % GOAL_COLORS.length] });
    setShowForm(true);
  };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setForm({ name: goal.name, targetAmount: goal.targetAmount, savedAmount: goal.savedAmount, color: goal.color });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) {
      toast.error('Please fill in all fields');
      return;
    }
    if (editingGoal) {
      updateGoal({
        id: editingGoal.id,
        name: form.name,
        targetAmount: Number(form.targetAmount),
        savedAmount: Number(form.savedAmount) || 0,
        color: form.color,
      });
      toast.success('Goal updated ✓');
    } else {
      addGoal({
        id: uuidv4(),
        name: form.name,
        targetAmount: Number(form.targetAmount),
        savedAmount: Number(form.savedAmount) || 0,
        color: form.color,
      });
      toast.success('Goal created ✓');
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteGoal(deleteId);
      toast.error('Goal deleted');
      setDeleteId(null);
    }
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const overallPercent = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Savings Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your progress towards financial targets
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#059669] text-white rounded-[1.5rem] font-medium text-sm hover:bg-[#065f46] transition-colors cursor-pointer"
        >
          <MdAdd className="text-lg" />
          New Goal
        </motion.button>
      </div>

      {/* Overall Summary Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <MdSavings className="text-xl text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Progress</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {formatINR(totalSaved)} saved of {formatINR(totalTarget)} total
            </p>
          </div>
          <span className="ml-auto text-lg font-bold text-emerald-600">{overallPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-16">
          <MdFlag className="text-5xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No goals yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create your first savings goal to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {goals.map((goal) => {
              const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
              const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);
              const isComplete = percent >= 100;

              return (
                <motion.div
                  layout
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative bg-white dark:bg-slate-800 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 group overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: goal.color }} />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-9 h-9 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: goal.color + '20', color: goal.color }}
                      >
                        <MdFlag className="text-lg" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{goal.name}</h3>
                        {isComplete && (
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">✓ Complete!</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(goal)}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        <MdEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteId(goal.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Circular progress */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="6" />
                        <circle
                          cx="32" cy="32" r="26" fill="none"
                          stroke={goal.color} strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={2 * Math.PI * 26 * (1 - percent / 100)}
                          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{percent.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 dark:text-slate-500">Saved</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{formatINR(goal.savedAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 dark:text-slate-500">Target</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{formatINR(goal.targetAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 dark:text-slate-500">Remaining</span>
                        <span className="font-semibold" style={{ color: goal.color }}>{formatINR(remaining)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick add savings */}
                  <button
                    onClick={() => {
                      const amt = prompt('Add savings amount (₹):');
                      if (amt && !isNaN(amt) && Number(amt) > 0) {
                        updateGoal({ id: goal.id, savedAmount: goal.savedAmount + Number(amt) });
                        toast.success(`Added ₹${Number(amt).toLocaleString('en-IN')} to ${goal.name}`);
                      }
                    }}
                    className="w-full py-2 text-xs font-medium rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    + Add Savings
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 w-full max-w-md border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {editingGoal ? 'Edit Goal' : 'New Goal'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 cursor-pointer">
                  <MdClose className="text-lg" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target (₹)</label>
                    <input
                      type="number"
                      value={form.targetAmount}
                      onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Saved (₹)</label>
                    <input
                      type="number"
                      value={form.savedAmount}
                      onChange={(e) => setForm((f) => ({ ...f, savedAmount: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
                  <div className="flex gap-2">
                    {GOAL_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, color: c }))}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          form.color === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-[#059669] text-white rounded-[1.5rem] font-semibold text-sm hover:bg-[#065f46] transition-colors cursor-pointer"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Goal?"
        message="This will permanently remove this savings goal."
      />
    </motion.div>
  );
};

export default Goals;
