const express = require('express');
const GetArticles = require('../../../usecases/GetArticles');
const GetArticleById = require('../../../usecases/GetArticleById');
const LikeArticle = require('../../../usecases/LikeArticle');
const AddComment = require('../../../usecases/AddComment');

const router = express.Router();

// Get all articles
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, categoryId, sortBy, sortOrder } = req.query;
    
    const getArticles = new GetArticles();
    const result = await getArticles.execute({ page, limit, categoryId, sortBy, sortOrder });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get single article by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const getArticleById = new GetArticleById();
    const article = await getArticleById.execute(id);
    
    res.json(article);
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

// Like an article
router.post('/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const likeArticle = new LikeArticle();
    const article = await likeArticle.execute(id);
    
    res.json({ likes: article.likes });
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

// Add comment to article
router.post('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, author, email } = req.body;
    
    const addComment = new AddComment();
    const comment = await addComment.execute({ content, author, email, articleId: id });
    
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === 'Article not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('required') || error.message.includes('Valid')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;