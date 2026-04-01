import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/currencyFormatter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 transition-colors duration-200 shadow-lg rounded-2xl px-3 py-2 border border-slate-100 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Day {label}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const DailyAreaChart = ({ data, className = '' }) => {
  // data: [{ day: '01', amount: 450 }, ...]

  return (
    <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Daily Spending</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyAreaChart;
