/**
 * Server-side API Client
 * For use in Server Components and Server Actions
 * 
 * WARNING: Server components cannot access localStorage.
 * This will make unauthenticated requests and may fail for protected endpoints.
 * 
 * Recommendation: Convert server components to client components that use
 * the regular api client (which reads from localStorage).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

export async function serverApiRequest<T = any>(
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
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions?.headers as Record<string, string>),
  }

  // Server components cannot access localStorage
  // No token available - will fail for protected endpoints
  // Convert components using this to client components instead

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    cache: 'no-store', // Don't cache for admin dashboard
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `API Error: ${response.statusText}`,
    }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T
  }

  return response.json()
}

// Convenience methods
export const serverApi = {
  get: <T = any>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    serverApiRequest<T>(endpoint, { method: 'GET', params }),

  post: <T = any>(endpoint: string, data?: any) =>
    serverApiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any) =>
    serverApiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string) =>
    serverApiRequest<T>(endpoint, { method: 'DELETE' }),
}

export default serverApi

