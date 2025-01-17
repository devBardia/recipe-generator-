export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    jwtStorageKey: import.meta.env.VITE_JWT_LOCAL_STORAGE_KEY || 'recipe_app_token',
} as const; 