class Article {
  constructor({
    id,
    title,
    content,
    summary,
    author,
    categoryId,
    publishedAt,
    likes = 0,
    views = 0,
    createdAt,
    updatedAt,
    category,
    comments = []
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.summary = summary;
    this.author = author;
    this.categoryId = categoryId;
    this.publishedAt = publishedAt;
    this.likes = likes;
    this.views = views;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.category = category;
    this.comments = comments;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      summary: this.summary,
      author: this.author,
      categoryId: this.categoryId,
      publishedAt: this.publishedAt,
      likes: this.likes,
      views: this.views,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      category: this.category,
      comments: this.comments
    };
  }
}

module.exports = Article;