# Interactive News Web App

A modern, interactive news application built with React, Node.js, Express, and MySQL. Features include article browsing, search, categories, comments, and likes.

## Features

- 📰 Browse news articles with pagination
- 🔍 Search articles by title and content
- 🏷️ Filter articles by categories
- 💬 Interactive commenting system
- ❤️ Like/unlike articles
- 📱 Responsive design
- ⚡ Fast and modern UI with React 19

## Quick Start

1. **Clone and navigate to project**
   ```bash
   git clone <repo-url>
   cd news-app
   ```

2. **Start the application**
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:4000
   - Health Check: http://localhost:4000/api/health

## Tech Stack

- **Frontend**: React 19.1.1, Vite 7.x
- **Backend**: Node.js 20.19.0, Express 5.1.x
- **Database**: MySQL 8.0 with Prisma 6.x
- **Container**: Docker + Docker Compose

## API Endpoints

- `GET /api/articles` - List articles with pagination and filters
- `GET /api/articles/:id` - Get single article with comments
- `POST /api/articles/:id/like` - Like/unlike an article
- `POST /api/articles/:id/comments` - Add comment to article
- `GET /api/categories` - List all categories
- `GET /api/search?q=term` - Search articles

## Development

```bash
# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop services
docker compose down

# Reset database
docker compose down -v
./run.sh
```