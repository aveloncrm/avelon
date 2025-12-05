'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import api from '@/lib/api'

export default function AcceptInvitePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    const acceptInvite = useCallback(async () => {
        try {
            const response = await api.get(`/api/team/accept?token=${token}`)

            setStatus('success')
            setMessage(response.message || 'Invite accepted successfully!')

            // Set the invited store as current and redirect
            setTimeout(() => {
                document.cookie = `currentStoreId=${response.storeId}; path=/; max-age=31536000`
                router.push('/')
            }, 2000)
        } catch (error: any) {
            setStatus('error')
            setMessage(error.message || 'Failed to accept invite')
        }
    }, [token, router])

    useEffect(() => {
        if (token) {
            acceptInvite()
        } else {
            setStatus('error')
            setMessage('Invalid invite link')
        }
    }, [token, acceptInvite])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    {status === 'loading' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            </div>
                            <CardTitle>Accepting Invite...</CardTitle>
                            <CardDescription>Please wait while we process your invitation</CardDescription>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <CardTitle>Success!</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <XCircle className="h-12 w-12 text-destructive" />
                            </div>
                            <CardTitle>Oops!</CardTitle>
                            <CardDescription className="text-destructive">{message}</CardDescription>
                        </>
                    )}
                </CardHeader>
                {status === 'success' && (
                    <CardContent className="text-center text-sm text-muted-foreground">
                        Redirecting you to the dashboard...
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
