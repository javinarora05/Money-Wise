import { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import useDebounce from './useDebounce';
import { isInRange } from '../utils/dateHelpers';

/**
 * Hook for filtering, searching, and sorting transactions.
 */
const useTransactions = () => {
  const { transactions } = useFinance();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    type: '', // '' | 'income' | 'expense'
    dateFrom: '',
    dateTo: '',
    recurring: null, // null = all, true/false = filter
  });
  const [sort, setSort] = useState({
    by: 'date', // 'date' | 'amount' | 'category'
    direction: 'desc',
  });

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = [...transactions];

    // Search: case-insensitive on title + notes
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.notes && t.notes.toLowerCase().includes(term))
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter((t) => filters.categories.includes(t.category));
    }

    // Filter by type
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter((t) =>
        isInRange(t.date, filters.dateFrom, filters.dateTo)
      );
    }

    // Filter by recurring
    if (filters.recurring !== null && filters.recurring !== undefined) {
      result = result.filter((t) => t.recurring === filters.recurring);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.by) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, debouncedSearch, filters, sort]);

  return {
    filtered,
    search,
    setSearch,
    filters,
    setFilters,
    sort,
    setSort,
  };
};

export default useTransactions;
