/**
 * Server-side API Client
 * For use in Server Components and Server Actions
 */

import { cookies } from 'next/headers'

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

  // Get cookies for authentication
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions?.headers as Record<string, string>),
  }
  
  // Add authentication token if available
  if (token) {
    headers['Cookie'] = `token=${token}`
  }

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

