import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import AddTransaction from './pages/AddTransaction/AddTransaction';
import EditTransaction from './pages/EditTransaction/EditTransaction';
import Budget from './pages/Budget/Budget';
import Goals from './pages/Goals/Goals';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FinanceProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <Navbar />
          <main className="pt-20 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/new" element={<AddTransaction />} />
                <Route path="/transactions/:id/edit" element={<EditTransaction />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/goals" element={<Goals />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </FinanceProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
