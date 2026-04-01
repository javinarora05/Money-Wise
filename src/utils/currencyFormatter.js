/**
 * Format a number as Indian Rupee currency
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format amount with the specified currency symbol
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
    SGD: 'S$',
    JPY: '¥',
  };

  const symbol = symbols[currency] || currency + ' ';

  if (currency === 'INR') {
    return formatINR(amount);
  }

  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

/**
 * Compact format for large numbers (e.g., 1.2K, 3.5L)
 */
export const formatCompact = (amount) => {
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatINR(amount);
};
