import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  MdDashboard,
  MdReceipt,
  MdAccountBalanceWallet,
  MdFlag,
  MdAdd,
  MdLightMode,
  MdDarkMode,
} from 'react-icons/md';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/transactions', label: 'Transactions', icon: MdReceipt },
  { to: '/budget', label: 'Budget', icon: MdAccountBalanceWallet },
  { to: '/goals', label: 'Goals', icon: MdFlag },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top accent gradient */}
      <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-[#059669] flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-[#059669] tracking-tight dark:text-slate-100">
              MoneyWise
            </span>
          </NavLink>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#d1fae5] dark:bg-[#059669]/20 text-[#065f46] dark:text-[#d1fae5]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Add & Theme Buttons */}
          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/transactions/new')}
              className="flex items-center gap-1.5 px-3 lg:px-4 py-2 bg-[#059669] text-white rounded-2xl font-medium text-sm hover:bg-[#065f46] transition-colors shadow-lg shadow-emerald-500/5 cursor-pointer"
            >
              <MdAdd className="text-lg" />
              <span className="hidden sm:inline">Add</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 transition-colors duration-200">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl text-xs transition-colors ${
                  isActive
                    ? 'text-[#065f46] dark:text-[#d1fae5]'
                    : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
