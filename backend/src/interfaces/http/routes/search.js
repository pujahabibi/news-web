const express = require('express');
const SearchArticles = require('../../../usecases/SearchArticles');

const router = express.Router();

// Search articles
router.get('/', async (req, res, next) => {
  try {
    const { q: query, page, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query parameter \'q\' is required' });
    }
    
    const searchArticles = new SearchArticles();
    const result = await searchArticles.execute({ query, page, limit });
    
    res.json(result);
  } catch (error) {
    if (error.message === 'Search query is required') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;