'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Deal } from '@/lib/mock-data/crm-deals'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AlertModal } from '@/components/modals/alert-modal'
import { ActivityTimeline } from '@/components/crm/activity-timeline'

const formSchema = z.object({
  name: z.string().min(1, 'Deal name is required'),
  company: z.string().min(1, 'Company is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Invalid email address'),
  value: z.coerce.number().min(0, 'Value must be positive'),
  stage: z.string().min(1, 'Stage is required'),
  probability: z.coerce.number().min(0).max(100, 'Probability must be between 0-100'),
  expectedCloseDate: z.string().min(1, 'Expected close date is required'),
  productService: z.string().min(1, 'Product/Service is required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  notes: z.string(),
  tags: z.string(),
})

type DealFormValues = z.infer<typeof formSchema>

interface DealFormProps {
  initialData: Deal | null
}

export function DealForm({ initialData }: DealFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit Deal' : 'Create Deal'
  const description = initialData ? 'Edit deal information' : 'Add a new deal to your pipeline'
  const toastMessage = initialData ? 'Deal updated successfully' : 'Deal created successfully'
  const action = initialData ? 'Save Changes' : 'Create Deal'

  const defaultValues: DealFormValues = initialData
    ? {
      name: initialData.name,
      company: initialData.company,
      contactName: initialData.contactName,
      contactEmail: initialData.contactEmail,
      value: initialData.value,
      stage: initialData.stage,
      probability: initialData.probability,
      expectedCloseDate: initialData.expectedCloseDate.split('T')[0],
      productService: initialData.productService,
      assignedTo: initialData.assignedTo,
      notes: initialData.notes,
      tags: initialData.tags.join(', '),
    }
    : {
      name: '',
      company: '',
      contactName: '',
      contactEmail: '',
      value: 0,
      stage: 'discovery',
      probability: 10,
      expectedCloseDate: '',
      productService: '',
      assignedTo: 'John Smith',
      notes: '',
      tags: '',
    }

  const form = useForm<DealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: DealFormValues) => {
    try {
      setLoading(true)
      // In a real app, you would make an API call here
      console.log('Deal data:', data)
      toast.success(toastMessage)
      router.push('/crm/pipeline')
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
      toast.success('Deal deleted successfully')
      router.push('/crm/pipeline')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
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
          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Deal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deal Name</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="Enterprise Annual Contract" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
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

                      <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deal Value ($)</FormLabel>
                            <FormControl>
                              <Input disabled={loading} type="number" placeholder="50000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <Input disabled={loading} placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input disabled={loading} type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="productService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product/Service</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="Enterprise Plan - Annual" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={loading}
                              placeholder="Additional notes about this deal..."
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

                {/* Deal Status */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deal Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stage</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="discovery">Discovery</SelectItem>
                                <SelectItem value="proposal">Proposal</SelectItem>
                                <SelectItem value="negotiation">Negotiation</SelectItem>
                                <SelectItem value="decision">Decision</SelectItem>
                                <SelectItem value="won">Won</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="probability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Probability (%)</FormLabel>
                            <FormControl>
                              <Input disabled={loading} type="number" min="0" max="100" placeholder="75" {...field} />
                            </FormControl>
                            <FormDescription>Likelihood of closing (0-100)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expectedCloseDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Close Date</FormLabel>
                            <FormControl>
                              <Input disabled={loading} type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value}>
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
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input disabled={loading} placeholder="enterprise, high-value" {...field} />
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

              {/* Activity Timeline */}
              {initialData && initialData.activities.length > 0 && (
                <ActivityTimeline activities={initialData.activities} />
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/crm/pipeline')}
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
        </div>
      </div>
    </>
  )
}

