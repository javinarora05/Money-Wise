import { motion, AnimatePresence } from 'framer-motion';
import { MdWarningAmber, MdClose } from 'react-icons/md';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-800 transition-colors duration-200 rounded-2xl shadow-xl max-w-sm w-full p-6">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 transition-colors cursor-pointer"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    variant === 'danger'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <MdWarningAmber className="text-2xl" />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center mb-6">
                {message}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 dark:bg-slate-900 transition-colors duration-200 transition-colors cursor-pointer"
                >
                  {cancelLabel}
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-2xl font-medium text-sm text-white transition-colors cursor-pointer ${
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {confirmLabel}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
