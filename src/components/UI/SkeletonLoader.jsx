import { motion } from 'framer-motion';

const SkeletonLoader = ({ className = '', count = 1, type = 'line' }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
              </div>
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 animate-pulse ${className}`}>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-48 bg-slate-100 dark:bg-slate-700/50 rounded" />
      </div>
    );
  }

  // Default: line skeleton
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((i) => (
        <motion.div
          key={i}
          className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
          style={{ width: `${75 + Math.random() * 25}%` }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
