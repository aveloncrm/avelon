// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
    free: {
        name: 'Free',
        price: 0,
        interval: 'month' as const,
        features: [
            '1 Store',
            '50 Products',
            '100 Orders/month',
            'Basic Analytics',
            'Email Support',
        ],
        limits: {
            stores: 1,
            products: 50,
            orders: 100, // per month
            storage: 500, // MB
            teamMembers: 1,
        },
    },
    starter: {
        name: 'Starter',
        price: 29,
        interval: 'month' as const,
        stripePriceId: process.env.STRIPE_STARTER_PRICE_ID, // Set in .env
        features: [
            '3 Stores',
            '500 Products',
            '1,000 Orders/month',
            'Advanced Analytics',
            'Custom Domain',
            'Email Support',
        ],
        limits: {
            stores: 3,
            products: 500,
            orders: 1000,
            storage: 5000, // MB (5GB)
            teamMembers: 3,
        },
    },
    pro: {
        name: 'Pro',
        price: 99,
        interval: 'month' as const,
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
        features: [
            '10 Stores',
            'Unlimited Products',
            'Unlimited Orders',
            'Advanced Analytics + Reports',
            'Custom Domain',
            'White-label Branding',
            'Priority Support',
            'API Access',
        ],
        limits: {
            stores: 10,
            products: -1, // unlimited
            orders: -1, // unlimited  
            storage: 50000, // MB (50GB)
            teamMembers: 10,
        },
    },
    enterprise: {
        name: 'Enterprise',
        price: null, // Custom pricing
        interval: 'month' as const,
        stripePriceId: null,
        features: [
            'Unlimited Stores',
            'Unlimited Products',
            'Unlimited Orders',
            'Custom Analytics',
            'Custom Domain',
            'Full White-label',
            'Dedicated Support',
            'API Access',
            'Custom Integrations',
            'SLA Guarantee',
        ],
        limits: {
            stores: -1, // unlimited
            products: -1,
            orders: -1,
            storage: -1, // unlimited
            teamMembers: -1,
        },
    },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
export type PlanLimits = typeof SUBSCRIPTION_PLANS[SubscriptionPlan]['limits']

/**
 * Check if merchant can perform an action based on plan limits
 */
export function canPerformAction(
    plan: SubscriptionPlan,
    action: keyof PlanLimits,
    currentUsage: number
): boolean {
    const limit = SUBSCRIPTION_PLANS[plan].limits[action]

    // Unlimited
    if (limit === -1) return true

    // Check against limit
    return currentUsage < limit
}

/**
 * Get human-readable limit text
 */
export function getLimitText(plan: SubscriptionPlan, action: keyof PlanLimits): string {
    const limit = SUBSCRIPTION_PLANS[plan].limits[action]

    if (limit === -1) return 'Unlimited'
    if (action === 'storage') return `${limit / 1000}GB`

    return limit.toString()
}
