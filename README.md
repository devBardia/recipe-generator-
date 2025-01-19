# Don't Know What to Cook

AI-powered recipe generator that helps you discover meals based on your available ingredients and preferences.

## Features
- 🤖 AI-powered recipe recommendations
- 📱 User authentication and profiles
- 💾 Save favorite recipes
- 🔍 Smart ingredient-based recipe search
- ⚡ Real-time recipe generation

## Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS for styling
- React Context for state management

### Backend
- FastAPI (Python)
- JWT authentication
- OpenAI API integration
- SQLAlchemy + PostgreSQL

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new user account
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh access token

### Recipes
- POST `/api/recipes/generate` - Generate recipe suggestions
- GET `/api/recipes/favorites` - Get user's favorite recipes
- POST `/api/recipes/favorites` - Save recipe to favorites
- DELETE `/api/recipes/favorites/{id}` - Remove recipe from favorites


