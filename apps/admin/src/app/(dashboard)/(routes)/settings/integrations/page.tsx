'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stripeKeys, setStripeKeys] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  async function fetchIntegrations() {
    try {
      // We'll implement this endpoint next
      const data = await api.get('/api/integrations/stripe')
      if (data) {
        setStripeKeys({
          publishableKey: data.publishableKey || '',
          secretKey: data.secretKey || '',
          webhookSecret: data.webhookSecret || '',
        })
        setIsConnected(!!data.publishableKey && !!data.secretKey)
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveStripe() {
    setSaving(true)
    try {
      await api.post('/api/integrations/stripe', stripeKeys)
      setIsConnected(!!stripeKeys.publishableKey && !!stripeKeys.secretKey)
      toast.success('Stripe settings saved.')
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Stripe Integration Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  Stripe Payments
                  {isConnected ? (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white shadow hover:bg-green-600">
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Not Connected
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Accept credit card payments directly on your store.
                </CardDescription>
              </div>
              {/* Stripe Logo could go here */}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="publishableKey">Publishable Key</Label>
              <Input
                id="publishableKey"
                placeholder="pk_test_..."
                value={stripeKeys.publishableKey}
                onChange={(e) => setStripeKeys({ ...stripeKeys, publishableKey: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="sk_test_..."
                value={stripeKeys.secretKey}
                onChange={(e) => setStripeKeys({ ...stripeKeys, secretKey: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
              <Input
                id="webhookSecret"
                type="password"
                placeholder="whsec_..."
                value={stripeKeys.webhookSecret}
                onChange={(e) => setStripeKeys({ ...stripeKeys, webhookSecret: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Used to verify webhook events from Stripe.
              </p>
            </div>
            <Button onClick={handleSaveStripe} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
