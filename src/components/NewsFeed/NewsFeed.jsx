import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOpenInNew, MdRefresh, MdNewspaper, MdImageNotSupported } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';

import { fetchFinanceNewsCached } from '../../services/newsService';
import SkeletonLoader from '../UI/SkeletonLoader';

const NewsFeed = ({ className = '' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const articles = await fetchFinanceNewsCached();
      setNews(articles);
    } catch (err) {
      setError('Could not load news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 ${className}`}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <MdNewspaper className="text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Market News</h3>
        </div>
        <div className="space-y-4">
          <SkeletonLoader count={3} type="article" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center ${className}`}>
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3">
          <MdNewspaper className="text-xl text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Failed to load news</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          onClick={fetchNews}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
        >
          <MdRefresh className="text-sm" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 transition-colors duration-200 rounded-[1.5rem] p-5 border border-slate-100 dark:border-slate-800 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <MdNewspaper className="text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Market News</h3>
        </div>
        <button 
          onClick={fetchNews}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
          title="Refresh News"
        >
          <MdRefresh className="text-base" />
        </button>
      </div>
      
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <AnimatePresence>
          {news.slice(0, 5).map((article, i) => (
            <motion.a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex gap-3 p-3 rounded-2xl border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="hidden sm:flex w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/50 items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                {article.urlToImage ? (
                  <img 
                    src={article.urlToImage} 
                    alt="" 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <MdImageNotSupported className="text-xl text-slate-300 dark:text-slate-500" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </p>
                  <MdOpenInNew className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 shrink-0 mt-0.5 text-[15px] opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    {article.source}
                  </span>
                  {article.publishedAt && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                      • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewsFeed;
