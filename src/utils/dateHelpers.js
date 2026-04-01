import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, subMonths, differenceInDays } from 'date-fns';

/**
 * Format a date string (YYYY-MM-DD) to a display format
 */
export const formatDate = (dateStr, formatStr = 'dd MMM yyyy') => {
  return format(parseISO(dateStr), formatStr);
};

/**
 * Format a date string to a short format (e.g., "05 Mar")
 */
export const formatDateShort = (dateStr) => {
  return format(parseISO(dateStr), 'dd MMM');
};

/**
 * Format month string (YYYY-MM) to display format
 */
export const formatMonth = (monthStr) => {
  return format(parseISO(`${monthStr}-01`), 'MMMM yyyy');
};

/**
 * Get the current month string in YYYY-MM format
 */
export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

/**
 * Get the previous month string in YYYY-MM format
 */
export const getPreviousMonth = (monthStr) => {
  const date = parseISO(`${monthStr}-01`);
  return format(subMonths(date, 1), 'yyyy-MM');
};

/**
 * Get all days in a given month
 */
export const getDaysInMonth = (monthStr) => {
  const start = startOfMonth(parseISO(`${monthStr}-01`));
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
};

/**
 * Check if a date falls within a month
 */
export const isInMonth = (dateStr, monthStr) => {
  return dateStr.startsWith(monthStr);
};

/**
 * Check if a date is within a range
 */
export const isInRange = (dateStr, fromStr, toStr) => {
  const date = parseISO(dateStr);
  const from = fromStr ? parseISO(fromStr) : new Date(0);
  const to = toStr ? parseISO(toStr) : new Date(9999, 11, 31);
  return isWithinInterval(date, { start: from, end: to });
};

/**
 * Get the number of days in a given month string
 */
export const getDayCount = (monthStr) => {
  const start = startOfMonth(parseISO(`${monthStr}-01`));
  const end = endOfMonth(start);
  return differenceInDays(end, start) + 1;
};

/**
 * Get a list of last N months as YYYY-MM strings
 */
export const getLastNMonths = (n, fromMonth) => {
  const base = parseISO(`${fromMonth}-01`);
  const months = [];
  for (let i = 0; i < n; i++) {
    months.push(format(subMonths(base, i), 'yyyy-MM'));
  }
  return months.reverse();
};

/**
 * Get today's date as YYYY-MM-DD
 */
export const getToday = () => {
  return format(new Date(), 'yyyy-MM-dd');
};
