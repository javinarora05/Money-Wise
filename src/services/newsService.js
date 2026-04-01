import axios from 'axios';

const CACHE_KEY = 'fintrack_news_cache';

/**
 * Fetch finance news for India, with sessionStorage caching.
 * @returns {Array} array of article objects
 */
export const fetchFinanceNewsCached = async () => {
  // Check session cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

  if (!apiKey || apiKey === 'your_news_api_key_here') {
    console.warn('News API key not configured');
    return getFallbackNews();
  }

  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        country: 'in',
        pageSize: 5,
        apiKey,
      },
    });

    const articles = (res.data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name || 'Unknown',
      publishedAt: a.publishedAt,
      urlToImage: a.urlToImage,
    }));

    if (articles.length === 0) {
      return getFallbackNews();
    }

    sessionStorage.setItem(CACHE_KEY, JSON.stringify(articles));
    return articles;
  } catch (error) {
    console.warn('News API failed:', error.message);
    return getFallbackNews();
  }
};

const getFallbackNews = () => [
  {
    title: 'RBI Keeps Repo Rate Steady at 6.5% Amid Inflation Concerns',
    description:
      'The Reserve Bank of India held its benchmark rate steady, citing stable growth and moderating inflation.',
    url: '#',
    source: 'Economic Times',
    publishedAt: new Date().toISOString(),
    urlToImage: null,
  },
  {
    title: 'Sensex Crosses 78,000 Mark for First Time',
    description:
      'Indian equity markets hit fresh highs driven by strong FII inflows and positive global cues.',
    url: '#',
    source: 'Mint',
    publishedAt: new Date().toISOString(),
    urlToImage: null,
  },
  {
    title: 'UPI Transactions Hit 16 Billion in February 2026',
    description:
      'Digital payments continue to surge with UPI processing record volumes.',
    url: '#',
    source: 'Business Standard',
    publishedAt: new Date().toISOString(),
    urlToImage: null,
  },
];
