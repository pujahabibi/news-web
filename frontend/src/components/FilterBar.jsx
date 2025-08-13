import React from 'react';

function FilterBar({ categories, filters, onFilterChange }) {
  const handleCategoryChange = (e) => {
    onFilterChange({ categoryId: e.target.value });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    onFilterChange({ sortBy, sortOrder });
  };

  const clearFilters = () => {
    onFilterChange({ categoryId: '', sortBy: 'publishedAt', sortOrder: 'desc' });
  };

  const hasActiveFilters = filters.categoryId || 
    filters.sortBy !== 'publishedAt' || 
    filters.sortOrder !== 'desc';

  return (
    <div className="filters-container">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            className="filter-select"
            value={filters.categoryId}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-filter">Sort by:</label>
          <select
            id="sort-filter"
            className="filter-select"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
          >
            <option value="publishedAt-desc">Newest First</option>
            <option value="publishedAt-asc">Oldest First</option>
            <option value="likes-desc">Most Liked</option>
            <option value="views-desc">Most Viewed</option>
            <option value="title-asc">Title A-Z</option>
          </select>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-outline btn-small"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;