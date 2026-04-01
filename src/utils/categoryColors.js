/**
 * Category color map for consistent styling throughout the app.
 * Each category has: text color, bg color, and a chart fill color.
 */
const categoryColors = {
  // Expense categories
  Food:           { text: '#92400E', bg: '#FEF3C7', chart: '#F59E0B' },
  Travel:         { text: '#1E40AF', bg: '#DBEAFE', chart: '#3B82F6' },
  Rent:           { text: '#374151', bg: '#F3F4F6', chart: '#6B7280' },
  Shopping:       { text: '#BE185D', bg: '#FCE7F3', chart: '#EC4899' },
  Entertainment:  { text: '#6D28D9', bg: '#EDE9FE', chart: '#8B5CF6' },
  Health:         { text: '#0F766E', bg: '#CCFBF1', chart: '#14B8A6' },
  Utilities:      { text: '#4B5563', bg: '#E5E7EB', chart: '#9CA3AF' },
  Subscriptions:  { text: '#3C3489', bg: '#EEEDFE', chart: '#7C3AED' },

  // Income categories
  Salary:           { text: '#0F766E', bg: '#CCFBF1', chart: '#14B8A6' },
  Freelance:        { text: '#065F46', bg: '#D1FAE5', chart: '#10B981' },
  Gift:             { text: '#B45309', bg: '#FEF3C7', chart: '#F59E0B' },
  'Investment Return': { text: '#1E40AF', bg: '#DBEAFE', chart: '#3B82F6' },

  // Fallback
  Other:            { text: '#4B5563', bg: '#F3F4F6', chart: '#6B7280' },
};

/**
 * Get colors for a category, with fallback to "Other"
 */
export const getCategoryColor = (category) => {
  return categoryColors[category] || categoryColors.Other;
};

/**
 * All expense categories
 */
export const EXPENSE_CATEGORIES = [
  'Food', 'Travel', 'Rent', 'Shopping', 'Entertainment',
  'Health', 'Utilities', 'Subscriptions', 'Other',
];

/**
 * All income categories
 */
export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Gift', 'Investment Return', 'Other',
];

/**
 * Chart color palette for recharts
 */
export const CHART_COLORS = [
  '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6',
  '#6B7280', '#10B981', '#7C3AED', '#EF4444',
];

export default categoryColors;
