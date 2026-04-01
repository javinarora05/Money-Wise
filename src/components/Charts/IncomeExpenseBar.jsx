import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatINR } from '../../utils/currencyFormatter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 transition-colors duration-200 shadow-lg rounded-2xl px-3 py-2 border border-slate-100 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
            {p.dataKey === 'income' ? 'Income' : 'Expense'}: {formatINR(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const IncomeExpenseBar = ({ data, className = '' }) => {
  // data: [{ month: 'Jan', income: 15000, expense: 12000 }, ...]

  return (
    <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Income vs Expense</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {value === 'income' ? 'Income' : 'Expense'}
              </span>
            )}
          />
          <Bar dataKey="income" fill="#27AE60" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="expense" fill="#E74C3C" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseBar;
