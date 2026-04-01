import { MdFilterList, MdClose, MdRefresh } from 'react-icons/md';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryColor } from '../../utils/categoryColors';

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES.filter(c => c !== 'Other')];

const Filters = ({ filters, setFilters, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = [
    filters.categories.length > 0,
    filters.type,
    filters.dateFrom,
    filters.dateTo,
    filters.recurring !== null && filters.recurring !== undefined,
  ].filter(Boolean).length;

  const clearAll = () => {
    setFilters({
      categories: [],
      type: '',
      dateFrom: '',
      dateTo: '',
      recurring: null,
    });
  };

  const toggleCategory = (cat) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  return (
    <div className={className}>
      {/* Filter toggle button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 transition-colors duration-200 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 dark:bg-slate-900 transition-colors duration-200 transition-colors cursor-pointer"
        >
          <MdFilterList className="text-lg" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 flex items-center justify-center bg-[#059669] text-white text-[10px] font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <MdRefresh className="text-sm" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-white dark:bg-slate-800 transition-colors duration-200 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] space-y-4">
              {/* Type toggle */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
                  Type
                </label>
                <div className="flex gap-2">
                  {['', 'income', 'expense'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters((prev) => ({ ...prev, type }))}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                        filters.type === type
                          ? 'bg-[#d1fae5] text-[#065f46]'
                          : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 dark:bg-slate-700'
                      }`}
                    >
                      {type === '' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category chips */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
                  Categories
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CATEGORIES.map((cat) => {
                    const isActive = filters.categories.includes(cat);
                    const color = getCategoryColor(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border"
                        style={{
                          backgroundColor: isActive ? color.bg : 'transparent',
                          color: isActive ? color.text : '#6B7280',
                          borderColor: isActive ? color.text + '30' : '#E5E7EB',
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date range */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 block">
                    From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 block">
                    To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
                  />
                </div>
              </div>

              {/* Recurring toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Recurring only
                </label>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      recurring: prev.recurring ? null : true,
                    }))
                  }
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    filters.recurring ? 'bg-[#059669]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-colors duration-200 shadow transition-transform ${
                      filters.recurring ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filters;
