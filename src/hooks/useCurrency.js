import { useState, useEffect } from 'react';
import { getExchangeRates, convertToINR } from '../services/currencyService';

/**
 * Hook for currency conversion with cached exchange rates.
 */
const useCurrency = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const fetchedRates = await getExchangeRates();
        setRates(fetchedRates);
        setError(null);
      } catch (err) {
        console.warn('Failed to fetch exchange rates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convert = (amount, fromCurrency) => {
    if (!rates || fromCurrency === 'INR') return amount;
    return convertToINR(amount, fromCurrency, rates);
  };

  return { convert, rates, loading, error };
};

export default useCurrency;
