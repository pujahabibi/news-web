const express = require('express');
const GetCategories = require('../../../usecases/GetCategories');

const router = express.Router();

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const getCategories = new GetCategories();
    const categories = await getCategories.execute();
    
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;