import { NextRequest } from 'next/server'

/**
 * Get the storeId from request headers
 * This should be set by middleware after subdomain/merchant verification
 */
export function getStoreId(req: Request | NextRequest): string | null {
    return req.headers.get('X-STORE-ID')
}

/**
 * Get the storeId from request headers and throw if not present
 * Use this in API routes that require store context
 */
export function requireStoreId(req: Request | NextRequest): string {
    const storeId = getStoreId(req)

    if (!storeId) {
        throw new Error('Store context is required but not found. Ensure middleware is properly configured.')
    }

    return storeId
}

/**
 * Get the merchantId from request headers (set by auth middleware)
 */
export function getMerchantId(req: Request | NextRequest): string | null {
    return req.headers.get('X-USER-ID')
}

/**
 * Get the merchantId from request headers and throw if not present
 */
export function requireMerchantId(req: Request | NextRequest): string {
    const merchantId = getMerchantId(req)

    if (!merchantId) {
        throw new Error('Authentication required')
    }

    return merchantId
}
