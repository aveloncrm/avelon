/**
 * API Client Helper
 * Centralized API request handler for the storefront
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
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

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      'X-STORE-ID': process.env.NEXT_PUBLIC_STORE_ID || 'default-store-001',
      ...fetchOptions?.headers,
    },
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

