import React, { useState } from 'react';

function Header({ onSearch, onNavigate, categories, currentPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    // Navigate to home with category filter
    onNavigate('home');
    // In a more complete implementation, you'd pass the category filter
    // For now, this just navigates to home
  };

  return (
    <header className="header">
      <div className="header-container">
        <div 
          className="logo" 
          onClick={() => onNavigate('home')}
        >
          📰 Interactive News
        </div>
        
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            🔍
          </button>
        </form>
        
        <nav className="nav-menu">
          <button
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          
          {categories.slice(0, 4).map(category => (
            <button
              key={category.id}
              className="nav-item"
              onClick={() => handleCategoryFilter(category.id)}
              title={category.description}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;