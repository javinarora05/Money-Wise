import axios from 'axios';

const CACHE_KEY = 'fintrack_exchange_rates';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

// Fallback rates (approximate INR rates per 1 unit of foreign currency)
const FALLBACK_RATES = {
  USD: 85.0,
  EUR: 93.0,
  GBP: 108.0,
  AED: 23.1,
  SGD: 63.5,
  JPY: 0.57,
};

/**
 * Get cached rates from localStorage
 */
const getCachedRates = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { rates, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) return rates;
    return null;
  } catch {
    return null;
  }
};

/**
 * Save rates to localStorage cache
 */
const setCachedRates = (rates) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ rates, timestamp: Date.now() })
    );
  } catch (e) {
    console.warn('Failed to cache exchange rates:', e);
  }
};

/**
 * Fetch exchange rates from API or cache.
 * Returns rates as { USD: number, EUR: number, ... } (how many INR per 1 foreign unit)
 */
export const getExchangeRates = async () => {
  // Check cache first
  const cached = getCachedRates();
  if (cached) return cached;

  const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;

  if (!apiKey || apiKey === 'your_exchangerate_api_key_here') {
    console.warn('Exchange rate API key not set — using fallback rates.');
    setCachedRates(FALLBACK_RATES);
    return FALLBACK_RATES;
  }

  try {
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/INR`
    );

    if (res.data && res.data.conversion_rates) {
      const inrRates = res.data.conversion_rates;
      // Convert from "1 INR = X foreign" to "1 foreign = X INR"
      const rates = {};
      ['USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY'].forEach((currency) => {
        rates[currency] = inrRates[currency]
          ? 1 / inrRates[currency]
          : FALLBACK_RATES[currency];
      });
      setCachedRates(rates);
      return rates;
    }
    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Exchange rate API failed, using fallback rates:', error.message);
    setCachedRates(FALLBACK_RATES);
    return FALLBACK_RATES;
  }
};

/**
 * Convert an amount from a foreign currency to INR.
 * @param {number} amount - amount in the foreign currency
 * @param {string} fromCurrency - currency code (e.g., 'USD')
 * @param {object} rates - rates object from getExchangeRates
 * @returns {number} rounded INR amount
 */
export const convertToINR = (amount, fromCurrency, rates) => {
  if (fromCurrency === 'INR') return amount;
  const rate = rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1;
  return Math.round(amount * rate);
};

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY'];
