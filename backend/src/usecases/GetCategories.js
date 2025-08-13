const CategoryRepository = require('../infra/repositories/CategoryRepository');

class GetCategories {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async execute() {
    return await this.categoryRepository.findAll();
  }
}

module.exports = GetCategories;