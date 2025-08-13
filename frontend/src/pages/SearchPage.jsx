import React, { useState, useEffect } from 'react';
import api from '../api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

function SearchPage({ query, onNavigate }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    if (query && query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setSearchPerformed(false);
    }
  }, [query, currentPage]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchPerformed(true);
      
      const response = await api.get('/search', {
        params: {
          q: query,
          page: currentPage,
          limit: 9
        }
      });
      
      setResults(response.articles);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="search-page">
        <div className="page-header text-center mb-3">
          <h1>Search Results</h1>
          <p className="text-muted">Searching for "{query}"...</p>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="search-page">
        <div className="page-header text-center mb-3">
          <h1>Search Results</h1>
          <p className="text-muted">Search for "{query}"</p>
        </div>
        <div className="error-container">
          <h2>Search Error</h2>
          <div className="error-message">{error}</div>
          <button onClick={performSearch} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="search-page">
      <div className="page-header text-center mb-3">
        <h1>Search Results</h1>
        {query && (
          <p className="text-muted">
            {searchPerformed ? `Results for "${query}"` : `Search for "${query}"`}
          </p>
        )}
      </div>

      {!query || !query.trim() ? (
        <div className="text-center mt-3">
          <h3>No search query</h3>
          <p className="text-muted">Enter a search term in the header to find articles.</p>
          <button onClick={() => onNavigate('home')} className="btn btn-primary">
            Browse All Articles
          </button>
        </div>
      ) : searchPerformed && results.length === 0 ? (
        <div className="text-center mt-3">
          <h3>No articles found</h3>
          <p className="text-muted">
            No articles match your search for "{query}". Try different keywords.
          </p>
          <button onClick={() => onNavigate('home')} className="btn btn-primary">
            Browse All Articles
          </button>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="mb-2">
            <p className="text-muted">
              Found {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} for "{query}"
            </p>
          </div>
          
          <div className="articles-grid">
            {results.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onNavigate('article', { articleId: article.id })}
                highlightQuery={query}
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
      ) : null}
    </div>
  );
}

export default SearchPage;