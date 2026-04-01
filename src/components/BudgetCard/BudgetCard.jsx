import { formatINR } from '../../utils/currencyFormatter';

const BudgetCard = ({ totalBudget, totalSpent, remaining, percentUsed, className = '' }) => {
  const clampedPercent = Math.min(Math.max(percentUsed, 0), 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercent / 100) * circumference;

  const getColor = (pct) => {
    if (pct >= 90) return '#ef4444';
    if (pct >= 70) return '#f59e0b';
    return '#059669';
  };

  const strokeColor = getColor(clampedPercent);

  return (
    <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-5">Monthly Budget</h3>

      {/* Circular gauge */}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-700"
              strokeWidth="10"
            />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {clampedPercent.toFixed(0)}%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">used</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Budget</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatINR(totalBudget)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Spent</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatINR(totalSpent)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Remaining</p>
            <p className={`text-sm font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {remaining >= 0 ? formatINR(remaining) : `-${formatINR(Math.abs(remaining))}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
