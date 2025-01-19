export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    tokenKey: 'recipe_app_token'
} as const; 