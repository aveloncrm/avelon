'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    const checkOnboarding = useCallback(async () => {
        try {
            // Don't run check on onboarding page itself
            if (window.location.pathname === '/onboarding') {
                setChecking(false)
                return
            }

            // The api.get returns the data directly, not wrapped in a .data property
            const stores = await api.get('/api/merchants/stores')

            // If no stores, redirect to onboarding wizard
            if (stores.length === 0) {
                setChecking(false)
                router.push('/onboarding')
                return
            }

            // If stores exist, ensure one is set as current
            const currentStoreId = document.cookie
                .split('; ')
                .find(row => row.startsWith('currentStoreId='))
                ?.split('=')[1]

            if (!currentStoreId) {
                // Set first store as current
                document.cookie = `currentStoreId=${stores[0].id}; path=/; max-age=31536000`
            }

            setChecking(false)
        } catch (error) {
            console.error('Onboarding check failed:', error)
            setChecking(false)
        }
    }, [router])

    useEffect(() => {
        checkOnboarding()
    }, [checkOnboarding])

    if (checking) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Loading...</h2>
                    <p className="text-muted-foreground">Setting up your dashboard</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
