# Don't Know What to Cook

AI-powered recipe generator that helps you discover meals based on your available ingredients and preferences.

## Features
- 🤖 AI-powered recipe recommendations based on ingredients
- 📱 User authentication and profile management
- 💾 Save and manage favorite recipes
- 🔍 Smart ingredient-based recipe search with image recognition
- ⚡ Real-time recipe generation with customizable preferences

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Heroicons for UI icons
- Context API for state management

### Backend
- FastAPI (Python)
- MongoDB with Motor for async database operations
- JWT for authentication
- OpenAI GPT for recipe generation
- GPT for ingredient recognition

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new user account
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh access token
- GET `/api/auth/me` - Get current user profile

### Recipes
- POST `/api/recipes/generate` - Generate recipe suggestions
- GET `/api/recipes/favorites` - Get user's favorite recipes
- POST `/api/recipes/favorites` - Save recipe to favorites
- DELETE `/api/recipes/favorites/{id}` - Remove recipe from favorites
- POST `/api/recipes/image` - Process ingredient image for recognition

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` in both frontend and backend directories
3. Install dependencies:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd backend && pip install -r requirements.txt
   ```
4. Start the development servers:
   ```bash
   # Frontend
   npm run dev
   
   # Backend
   uvicorn main:app --reload
   ```


