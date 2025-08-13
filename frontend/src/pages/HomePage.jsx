import React, { useState, useEffect } from 'react';
import api from '../api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import FilterBar from '../components/FilterBar';

function HomePage({ onNavigate, categories }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    categoryId: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadArticles();
  }, [currentPage, filters]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 9,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await api.get('/articles', { params });
      setArticles(response.articles);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Articles</h2>
        <div className="error-message">{error}</div>
        <button onClick={loadArticles} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="page-header text-center mb-3">
        <h1>Latest News</h1>
        <p className="text-muted">
          Stay updated with the latest news across technology, business, science, and sports
        </p>
      </div>

      <FilterBar 
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {articles.length === 0 ? (
        <div className="text-center mt-3">
          <h3>No articles found</h3>
          <p className="text-muted">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="articles-grid">
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onNavigate('article', { articleId: article.id })}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              total={pagination.total}
            />
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;