/**
 * API Client Helper
 * Centralized API request handler for the admin panel
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

// Token storage key
const TOKEN_KEY = 'auth_token'

// Helper functions for token management
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },
  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
  },
}

export async function apiRequest<T = any>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> {
  const { params, ...fetchOptions } = options || {}
  
  // Build URL with query parameters if provided
  let url = `${API_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    url += `?${searchParams.toString()}`
  }

  // Get token from localStorage
  const token = tokenStorage.get()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions?.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include', // Keep for CORS
    headers,
  })

  // Handle non-OK responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `API Error: ${response.statusText}`,
    }))
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T
  }

  return response.json()
}

// Convenience methods for common HTTP verbs
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
}

export default api

