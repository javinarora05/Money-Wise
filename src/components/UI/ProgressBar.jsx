const ProgressBar = ({ percent = 0, className = '', size = 'md', showLabel = true }) => {
  const getColor = (pct) => {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTrackColor = (pct) => {
    if (pct >= 90) return 'bg-red-100';
    if (pct >= 70) return 'bg-amber-100';
    return 'bg-emerald-100';
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">
            {clampedPercent.toFixed(0)}% used
          </span>
        </div>
      )}
      <div
        className={`w-full ${heights[size]} rounded-full overflow-hidden ${getTrackColor(clampedPercent)}`}
      >
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ease-out ${getColor(clampedPercent)}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
