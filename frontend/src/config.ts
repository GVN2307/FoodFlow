// Auto-detect production API URL
// If VITE_API_URL is set (in .env), use it.
// Otherwise, default to localhost for development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Helper to construct full URLs
export const getApiUrl = (endpoint: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};
