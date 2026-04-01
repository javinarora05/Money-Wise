import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryColor, CHART_COLORS } from '../../utils/categoryColors';
import { formatINR } from '../../utils/currencyFormatter';

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    const pct = ((d.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white dark:bg-slate-800 transition-colors duration-200 shadow-lg rounded-2xl px-3 py-2 border border-slate-100 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{d.name}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">{formatINR(d.value)} ({pct}%)</p>
      </div>
    );
  }
  return null;
};

const SpendingPieChart = ({ data, className = '' }) => {
  // data: { [category]: amount }
  const chartData = Object.entries(data)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      color: getCategoryColor(category).chart,
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (chartData.length === 0) return null;

  return (
    <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip total={total} />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingPieChart;
