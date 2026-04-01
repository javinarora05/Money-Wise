import { motion } from 'framer-motion';
import { MdInbox } from 'react-icons/md';

const EmptyState = ({
  icon: Icon = MdInbox,
  title = 'No data yet',
  description = 'Get started by adding your first item.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mb-5">
        <Icon className="text-3xl text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-5 py-2.5 bg-[#059669] text-white rounded-2xl font-medium text-sm hover:bg-[#065f46] transition-colors shadow-lg shadow-emerald-500/5 cursor-pointer"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
