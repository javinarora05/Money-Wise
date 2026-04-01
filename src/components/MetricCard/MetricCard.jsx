import { motion } from 'framer-motion';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = '#059669', trend, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 hover:shadow-2xl shadow-emerald-500/10 transition-shadow ${className}`}
    >
      {/* Colored accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-[1.5rem]"
        style={{ backgroundColor: color }}
      />

      {/* Icon centered on top */}
      {Icon && (
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3"
          style={{ backgroundColor: color + '15', color }}
        >
          <Icon className="text-xl" />
        </div>
      )}

      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {subtitle && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
      )}
      {trend && (
        <p className={`text-xs font-medium mt-1.5 ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </p>
      )}
    </motion.div>
  );
};

export default MetricCard;
