'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { EnrichedLead } from '@/lib/mock-data/crm-unified'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash, Save, TrendingUp, ArrowRight, ExternalLink, Activity as ActivityIcon, Target } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AlertModal } from '@/components/modals/alert-modal'
import { Badge } from '@/components/ui/badge'
import { ActivityTimeline } from '@/components/crm/activity-timeline'
import { format } from 'date-fns'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { getLeadScoreConfig } from '@/lib/lead-scoring-utils'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  source: z.string().min(1, 'Source is required'),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  estimatedValue: z.coerce.number().min(0, 'Value must be positive'),
  notes: z.string(),
  tags: z.string(),
})

type LeadFormValues = z.infer<typeof formSchema>

interface LeadFormProps {
  initialData: EnrichedLead | null
}

export function LeadForm({ initialData }: LeadFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [convertModalOpen, setConvertModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Lead Details' : 'Create Lead'
  const description = initialData ? 'Manage lead information and activities' : 'Add a new lead to your CRM'
  const toastMessage = initialData ? 'Lead updated successfully' : 'Lead created successfully'
  const action = initialData ? 'Save Changes' : 'Create Lead'

  const canConvert = initialData && (initialData.status === 'qualified' || initialData.status === 'converted')
  const isConverted = initialData?.status === 'converted'

  const defaultValues: LeadFormValues = initialData
    ? {
        name: initialData.contact.name,
        email: initialData.contact.email,
        phone: initialData.contact.phone,
        company: initialData.contact.company,
        jobTitle: initialData.contact.jobTitle,
        source: initialData.source,
        status: initialData.status,
        priority: initialData.priority,
        assignedTo: initialData.assignedTo,
        estimatedValue: initialData.estimatedValue,
        notes: initialData.notes,
        tags: initialData.contact.tags.join(', '),
      }
    : {
        name: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        source: 'website',
        status: 'new',
        priority: 'medium',
        assignedTo: 'John Smith',
        estimatedValue: 0,
        notes: '',
        tags: '',
      }

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setLoading(true)
      // In a real app, you would make an API call here
      console.log('Lead data:', data)
      toast.success(toastMessage)
      router.push('/crm/leads')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      // In a real app, you would make an API call here
      toast.success('Lead deleted successfully')
      router.push('/crm/leads')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const onConvertToDeal = async () => {
    try {
      setLoading(true)
      // In a real app, you would make an API call here
      // This would create a new deal and link it to the lead
      toast.success('Lead converted to deal successfully')
      // Redirect to the new deal page
      router.push(`/crm/pipeline/${initialData?.convertedToDealId || 'd1'}`)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
      setConvertModalOpen(false)
    }
  }

  // Using shared scoring utilities
  const scoreConfig = initialData ? getLeadScoreConfig(initialData.score) : null

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <AlertModal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        onConfirm={onConvertToDeal}
        loading={loading}
        title="Convert Lead to Deal?"
        description="This will create a new deal opportunity from this lead. The lead status will be updated to 'Converted'."
      />
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            <div className="flex gap-2">
              {initialData && canConvert && !isConverted && (
                <Button
                  disabled={loading}
                  variant="default"
                  onClick={() => setConvertModalOpen(true)}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Convert to Deal
                </Button>
              )}
              {initialData && isConverted && initialData.deal && (
                <Link href={`/crm/pipeline/${initialData.deal.id}`}>
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Deal
                  </Button>
                </Link>
              )}
              {initialData && (
                <Button
                  disabled={loading}
                  variant="destructive"
                  size="icon"
                  onClick={() => setOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <Separator />

          {/* Converted Deal Banner */}
          {initialData && isConverted && initialData.deal && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-600 p-2">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">Lead Converted</h4>
                    <p className="text-sm text-green-700">
                      This lead was converted to a deal: {initialData.deal.name}
                    </p>
                  </div>
                </div>
                <Link href={`/crm/pipeline/${initialData.deal.id}`}>
                  <Button variant="outline" size="sm" className="border-green-300">
                    View Deal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Lead Scoring Section */}
          {initialData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lead Score & Qualification
                </CardTitle>
                <CardDescription>
                  AI-powered lead scoring based on engagement and fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Lead Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-bold ${scoreConfig?.color}`}>
                          {initialData.score}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {scoreConfig?.icon} {scoreConfig?.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Value</p>
                      <p className="text-2xl font-bold">
                        ${(initialData.estimatedValue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Conversion Potential</span>
                      <span className="font-medium">{initialData.score}%</span>
                    </div>
                    <Progress value={initialData.score} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="text-lg font-semibold">
                        {initialData.activities.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Last Contact</p>
                      <p className="text-lg font-semibold">
                        {initialData.lastContactedAt 
                          ? format(new Date(initialData.lastContactedAt), 'd')
                          : 'Never'}
                      </p>
                      <p className="text-xs text-muted-foreground">days ago</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Priority</p>
                      <Badge 
                        variant={
                          initialData.priority === 'urgent' ? 'destructive' :
                          initialData.priority === 'high' ? 'default' :
                          'secondary'
                        }
                      >
                        {initialData.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input disabled={loading} placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input disabled={loading} placeholder="CEO" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder="+1 (555) 123-4567"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              placeholder="Additional notes about this lead..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Status & Assignment */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status & Priority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="unqualified">Unqualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source</FormLabel>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                                <SelectItem value="social_media">Social Media</SelectItem>
                                <SelectItem value="email_campaign">Email Campaign</SelectItem>
                                <SelectItem value="cold_call">Cold Call</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="partner">Partner</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Assignment & Value</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select team member" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="John Smith">John Smith</SelectItem>
                                <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                                <SelectItem value="Robert Brown">Robert Brown</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estimatedValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Value ($)</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                type="number"
                                placeholder="50000"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Potential deal value</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder="enterprise, hot-lead"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Comma-separated tags</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/crm/leads')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {action}
                </Button>
              </div>
            </form>
          </Form>

          {/* Activity Timeline */}
          {initialData && initialData.activities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
                <CardDescription>
                  All interactions with this lead ({initialData.activities.length} activities)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityTimeline activities={initialData.activities} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

