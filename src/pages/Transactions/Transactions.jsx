import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdAdd, MdSort, MdArrowUpward, MdArrowDownward, MdFileDownload } from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import useTransactions from '../../hooks/useTransactions';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import ConfirmModal from '../../components/UI/ConfirmModal';
import EmptyState from '../../components/UI/EmptyState';

const ITEMS_PER_PAGE = 15;

const Transactions = () => {
  const navigate = useNavigate();
  const { deleteTransaction } = useFinance();
  const { filtered, search, setSearch, filters, setFilters, sort, setSort } = useTransactions();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      toast.error('Deleted');
      setDeleteId(null);
    }
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      by: field,
      direction: prev.by === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const exportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount (₹)', 'Recurring', 'Notes'];
    const rows = filtered.map((tx) => [
      tx.date,
      `"${tx.title}"`,
      tx.type,
      tx.category,
      tx.amount,
      tx.recurring ? 'Yes' : 'No',
      `"${tx.notes || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} transactions`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-[1.5rem] font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <MdFileDownload className="text-lg" />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/transactions/new')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#059669] text-white rounded-[1.5rem] font-medium text-sm hover:bg-[#065f46] transition-colors shadow-lg shadow-emerald-500/5 cursor-pointer"
          >
            <MdAdd className="text-lg" />
            Add Transaction
          </motion.button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3 mb-6">
        <SearchBar value={search} onChange={setSearch} resultCount={search ? filtered.length : undefined} />
        <div className="flex flex-wrap items-center gap-3">
          <Filters filters={filters} setFilters={setFilters} />

          {/* Sort buttons */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-1"><MdSort className="inline text-base" /> Sort:</span>
            {['date', 'amount', 'category'].map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${
                  sort.by === field
                    ? 'bg-[#d1fae5] text-[#065f46]'
                    : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 dark:bg-slate-700/50'
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sort.by === field && (
                  sort.direction === 'asc'
                    ? <MdArrowUpward className="text-xs" />
                    : <MdArrowDownward className="text-xs" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <EmptyState
          title={search || Object.values(filters).some((v) => v && (Array.isArray(v) ? v.length : true))
            ? 'No transactions match your search'
            : 'No transactions yet'}
          description={search ? `No results for "${search}"` : 'Add your first transaction to get started!'}
          actionLabel={!search ? 'Add Transaction' : undefined}
          onAction={!search ? () => navigate('/transactions/new') : undefined}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {paginated.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700/30 dark:bg-slate-900 transition-colors duration-200 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700/30 dark:bg-slate-900 transition-colors duration-200 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction?"
        message="This action cannot be undone. The transaction will be permanently removed."
      />
    </motion.div>
  );
};

export default Transactions;
