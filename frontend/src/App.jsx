import React, { useState, useEffect } from 'react';
import api from './api';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import SearchPage from './pages/SearchPage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (page, data = {}) => {
    setCurrentPage(page);
    if (page === 'article') {
      setSelectedArticleId(data.articleId);
    }
    if (page === 'search') {
      setSearchQuery(data.query || '');
    }
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage('search');
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Error Loading Application</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch} 
        onNavigate={handleNavigation}
        categories={categories}
        currentPage={currentPage}
      />
      
      <main className="main-content">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={handleNavigation} 
            categories={categories}
          />
        )}
        
        {currentPage === 'article' && selectedArticleId && (
          <ArticlePage 
            articleId={selectedArticleId}
            onNavigate={handleNavigation}
          />
        )}
        
        {currentPage === 'search' && (
          <SearchPage 
            query={searchQuery}
            onNavigate={handleNavigation}
            categories={categories}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;