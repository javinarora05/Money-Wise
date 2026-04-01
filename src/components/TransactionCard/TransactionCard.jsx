import { motion } from 'framer-motion';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { formatINR, formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateHelpers';
import { getCategoryColor } from '../../utils/categoryColors';

const TransactionCard = ({ transaction, onDelete }) => {
  const navigate = useNavigate();
  const { id, title, amount, originalAmount, originalCurrency, category, type, date, notes, recurring } = transaction;
  const catColor = getCategoryColor(category);
  const isExpense = type === 'expense';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-4 pl-5 border border-slate-100 dark:border-slate-800 hover:shadow-2xl shadow-emerald-500/10 transition-shadow group overflow-hidden"
    >
      {/* Left color accent strip */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
        style={{ backgroundColor: isExpense ? '#ef4444' : '#059669' }}
      />

      <div className="flex items-center gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h4>
            {recurring && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                ↻ recurring
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ backgroundColor: catColor.bg, color: catColor.text }}
            >
              {category}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatDate(date)}</span>
          </div>
          {notes && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate italic">{notes}</p>
          )}
        </div>

        {/* Amount + actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-sm font-bold ${
                isExpense ? 'text-red-500' : 'text-emerald-600'
              }`}
            >
              {isExpense ? '−' : '+'}{formatINR(amount)}
            </p>
            {originalCurrency !== 'INR' && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {formatCurrency(originalAmount, originalCurrency)}
              </p>
            )}
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigate(`/transactions/${id}/edit`)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 dark:text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              title="Edit"
            >
              <MdEdit className="text-base" />
            </button>
            <button
              onClick={() => onDelete && onDelete(id)}
              className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete"
            >
              <MdDelete className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
