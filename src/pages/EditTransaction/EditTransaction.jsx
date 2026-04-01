import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdArrowBack } from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/categoryColors';

const schema = yup.object({
  title: yup.string().min(2, 'Min 2 characters').max(60, 'Max 60 characters').required('Title is required'),
  amount: yup.number().typeError('Enter a valid number').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: yup.string().required('Date is required').test('not-future', 'Cannot be a future date', (value) => {
    if (!value) return false;
    return new Date(value) <= new Date();
  }),
  notes: yup.string().max(200, 'Max 200 characters'),
});

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, updateTransaction } = useFinance();

  const transaction = transactions.find((t) => t.id === id);
  const [selectedType, setSelectedType] = useState(transaction?.type || 'expense');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: '',
      notes: '',
      recurring: false,
    },
  });

  // Pre-fill form with existing transaction
  useEffect(() => {
    if (transaction) {
      reset({
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
        notes: transaction.notes || '',
        recurring: transaction.recurring,
      });
      setSelectedType(transaction.type);
    }
  }, [transaction, reset]);

  const categories = selectedType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setValue('type', type);
    setValue('category', '');
  };

  const onSubmit = async (data) => {
    updateTransaction({
      id,
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      type: data.type,
      date: data.date,
      notes: data.notes || '',
      recurring: data.recurring || false,
    });

    toast.info('Transaction updated');
    navigate('/transactions');
  };

  if (!transaction) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Transaction not found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">The transaction may have been deleted.</p>
        <button
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 bg-[#059669] text-white rounded-2xl text-sm font-medium cursor-pointer"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
        >
          <MdArrowBack className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Transaction</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-2xl shadow-lg shadow-emerald-500/5 border border-slate-100 dark:border-slate-800 p-6">
        {/* Type toggle */}
        <div className="flex gap-2 mb-6">
          {['expense', 'income'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`flex-1 py-2.5 rounded-[1.5rem] text-sm font-semibold transition-colors cursor-pointer ${
                selectedType === type
                  ? type === 'expense'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
              id="edit-title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
              id="edit-amount"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
              id="edit-category"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input
              {...register('date')}
              type="date"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-900 dark:text-slate-100"
              id="edit-date"
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (optional)</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none bg-white dark:bg-slate-900 dark:text-slate-100"
              id="edit-notes"
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Recurring transaction</label>
            <input
              type="checkbox"
              {...register('recurring')}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              id="edit-recurring"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 bg-[#059669] text-white rounded-[1.5rem] font-semibold text-sm hover:bg-[#065f46] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditTransaction;
