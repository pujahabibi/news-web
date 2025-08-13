const express = require('express');
const { body, validationResult } = require('express-validator');

// Usecases
const GetArticles = require('../../../usecases/GetArticles');
const GetArticleById = require('../../../usecases/GetArticleById');
const CreateArticle = require('../../../usecases/CreateArticle');
const UpdateArticle = require('../../../usecases/UpdateArticle');
const LikeArticle = require('../../../usecases/LikeArticle');
const AddComment = require('../../../usecases/AddComment');

// Repositories
const ArticleRepository = require('../../../infra/repositories/ArticleRepository');

const router = express.Router();
const articleRepository = new ArticleRepository();

// Get all articles
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, categoryId, sortBy, sortOrder } = req.query;
    
    const getArticles = new GetArticles();
    const result = await getArticles.execute({ page, limit, categoryId, sortBy, sortOrder }); // This use case may need the repo
    
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

// Create a new article
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('categoryId').isInt().withMessage('Category ID must be an integer')
    // thumbnailUrl is optional
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const createArticle = new CreateArticle(articleRepository);
      const article = await createArticle.execute(req.body);
      res.status(201).json(article);
    } catch (error) {
      next(error);
    }
  }
);

// Update an existing article
router.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('categoryId').isInt().withMessage('Category ID must be an integer')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const updateArticle = new UpdateArticle(articleRepository);
      const article = await updateArticle.execute(id, req.body);
      res.json(article);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
