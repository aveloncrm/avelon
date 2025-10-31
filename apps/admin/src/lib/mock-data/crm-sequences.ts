export type SequenceStatus = 'draft' | 'active' | 'paused' | 'archived'
export type SequenceChannel = 'email' | 'sms' | 'linkedin' | 'call'

export interface OutreachSequence {
  id: string
  name: string
  status: SequenceStatus
  channel: SequenceChannel
  steps: SequenceStep[]
  enrolled: number
  active: number
  completed: number
  replied: number
  replyRate: number
  booked: number
  bookingRate: number
  createdBy: string
  createdAt: string
  lastModifiedAt: string
  description: string
}

export interface SequenceStep {
  id: string
  order: number
  type: 'email' | 'sms' | 'call' | 'task' | 'linkedin'
  subject?: string
  template: string
  delay: number
  delayUnit: 'hours' | 'days'
  automaticFollowUp: boolean
}

export interface EngagementActivity {
  id: string
  leadId: string
  leadName: string
  type: 'email_sent' | 'email_opened' | 'email_clicked' | 'email_replied' | 'call_made' | 'call_answered' | 'meeting_booked' | 'sms_sent' | 'sms_replied'
  channel: string
  subject?: string
  timestamp: string
  performedBy: string
  metadata?: Record<string, any>
}

export const mockSequences: OutreachSequence[] = [
  {
    id: '1',
    name: 'Enterprise Cold Outreach',
    status: 'active',
    channel: 'email',
    enrolled: 156,
    active: 89,
    completed: 45,
    replied: 28,
    replyRate: 17.9,
    booked: 12,
    bookingRate: 7.7,
    createdBy: 'John Smith',
    createdAt: '2025-09-15T10:00:00Z',
    lastModifiedAt: '2025-10-10T14:30:00Z',
    description: 'Cold outreach sequence for enterprise prospects with personalized approach.',
    steps: [
      {
        id: 'step1',
        order: 1,
        type: 'email',
        subject: 'Quick question about {{company}}',
        template: 'Hi {{firstName}}, I noticed your company is growing fast...',
        delay: 0,
        delayUnit: 'hours',
        automaticFollowUp: true,
      },
      {
        id: 'step2',
        order: 2,
        type: 'email',
        subject: 'Re: Quick question about {{company}}',
        template: 'Following up on my previous email...',
        delay: 3,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
      {
        id: 'step3',
        order: 3,
        type: 'call',
        template: 'Call script: Introduce value proposition...',
        delay: 2,
        delayUnit: 'days',
        automaticFollowUp: false,
      },
      {
        id: 'step4',
        order: 4,
        type: 'email',
        subject: 'Final attempt - {{company}} + our solution',
        template: 'This is my last attempt to reach you...',
        delay: 4,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Demo Follow-up Sequence',
    status: 'active',
    channel: 'email',
    enrolled: 78,
    active: 34,
    completed: 38,
    replied: 42,
    replyRate: 53.8,
    booked: 18,
    bookingRate: 23.1,
    createdBy: 'Emily Davis',
    createdAt: '2025-09-20T11:00:00Z',
    lastModifiedAt: '2025-10-12T09:15:00Z',
    description: 'Follow-up sequence for prospects who attended product demo.',
    steps: [
      {
        id: 'step5',
        order: 1,
        type: 'email',
        subject: 'Thanks for attending the demo!',
        template: 'It was great showing you our platform...',
        delay: 2,
        delayUnit: 'hours',
        automaticFollowUp: true,
      },
      {
        id: 'step6',
        order: 2,
        type: 'email',
        subject: 'Resources from our demo',
        template: 'Here are the materials we discussed...',
        delay: 1,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
      {
        id: 'step7',
        order: 3,
        type: 'task',
        template: 'Call to discuss next steps and pricing',
        delay: 3,
        delayUnit: 'days',
        automaticFollowUp: false,
      },
    ],
  },
  {
    id: '3',
    name: 'LinkedIn Connection Sequence',
    status: 'active',
    channel: 'linkedin',
    enrolled: 245,
    active: 178,
    completed: 45,
    replied: 52,
    replyRate: 21.2,
    booked: 15,
    bookingRate: 6.1,
    createdBy: 'Robert Brown',
    createdAt: '2025-10-01T14:00:00Z',
    lastModifiedAt: '2025-10-15T16:20:00Z',
    description: 'LinkedIn outreach for warm connections and referrals.',
    steps: [
      {
        id: 'step8',
        order: 1,
        type: 'linkedin',
        template: 'Send connection request with personalized note',
        delay: 0,
        delayUnit: 'hours',
        automaticFollowUp: true,
      },
      {
        id: 'step9',
        order: 2,
        type: 'linkedin',
        template: 'Thank you message after connection',
        delay: 1,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
      {
        id: 'step10',
        order: 3,
        type: 'linkedin',
        template: 'Share valuable content or insight',
        delay: 3,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
      {
        id: 'step11',
        order: 4,
        type: 'linkedin',
        template: 'Soft pitch with calendar link',
        delay: 5,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Trial User Engagement',
    status: 'active',
    channel: 'email',
    enrolled: 312,
    active: 156,
    completed: 134,
    replied: 89,
    replyRate: 28.5,
    booked: 45,
    bookingRate: 14.4,
    createdBy: 'John Smith',
    createdAt: '2025-09-25T09:00:00Z',
    lastModifiedAt: '2025-10-14T11:45:00Z',
    description: 'Engagement sequence for trial users to drive activation and conversion.',
    steps: [
      {
        id: 'step12',
        order: 1,
        type: 'email',
        subject: 'Welcome to your trial!',
        template: 'Get started with these quick wins...',
        delay: 0,
        delayUnit: 'hours',
        automaticFollowUp: true,
      },
      {
        id: 'step13',
        order: 2,
        type: 'email',
        subject: 'Day 3: Unlock these powerful features',
        template: 'Did you know you can also...',
        delay: 3,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
      {
        id: 'step14',
        order: 3,
        type: 'email',
        subject: 'Your trial is halfway through',
        template: 'You have 7 days left. Let us help...',
        delay: 4,
        delayUnit: 'days',
        automaticFollowUp: true,
      },
    ],
  },
]

export const mockEngagementActivities: EngagementActivity[] = [
  {
    id: '1',
    leadId: '1',
    leadName: 'Sarah Johnson',
    type: 'email_sent',
    channel: 'email',
    subject: 'Quick question about TechCorp',
    timestamp: '2025-10-17T09:00:00Z',
    performedBy: 'John Smith',
  },
  {
    id: '2',
    leadId: '1',
    leadName: 'Sarah Johnson',
    type: 'email_opened',
    channel: 'email',
    subject: 'Quick question about TechCorp',
    timestamp: '2025-10-17T09:15:00Z',
    performedBy: 'Sarah Johnson',
  },
  {
    id: '3',
    leadId: '1',
    leadName: 'Sarah Johnson',
    type: 'email_replied',
    channel: 'email',
    subject: 'Re: Quick question about TechCorp',
    timestamp: '2025-10-17T10:30:00Z',
    performedBy: 'Sarah Johnson',
  },
  {
    id: '4',
    leadId: '2',
    leadName: 'Michael Chen',
    type: 'call_made',
    channel: 'phone',
    timestamp: '2025-10-17T11:00:00Z',
    performedBy: 'Emily Davis',
    metadata: { duration: 1200, outcome: 'interested' },
  },
  {
    id: '5',
    leadId: '2',
    leadName: 'Michael Chen',
    type: 'meeting_booked',
    channel: 'calendar',
    timestamp: '2025-10-17T11:15:00Z',
    performedBy: 'Emily Davis',
    metadata: { meetingDate: '2025-10-20T14:00:00Z', type: 'demo' },
  },
  {
    id: '6',
    leadId: '3',
    leadName: 'Amanda Martinez',
    type: 'email_sent',
    channel: 'email',
    subject: 'Demo follow-up and resources',
    timestamp: '2025-10-16T15:00:00Z',
    performedBy: 'John Smith',
  },
  {
    id: '7',
    leadId: '3',
    leadName: 'Amanda Martinez',
    type: 'email_opened',
    channel: 'email',
    subject: 'Demo follow-up and resources',
    timestamp: '2025-10-16T15:45:00Z',
    performedBy: 'Amanda Martinez',
  },
  {
    id: '8',
    leadId: '3',
    leadName: 'Amanda Martinez',
    type: 'email_clicked',
    channel: 'email',
    timestamp: '2025-10-16T15:50:00Z',
    performedBy: 'Amanda Martinez',
    metadata: { link: 'case-study-download' },
  },
  {
    id: '9',
    leadId: '4',
    leadName: 'David Wilson',
    type: 'sms_sent',
    channel: 'sms',
    timestamp: '2025-10-15T10:00:00Z',
    performedBy: 'Emily Davis',
  },
  {
    id: '10',
    leadId: '5',
    leadName: 'Lisa Anderson',
    type: 'call_made',
    channel: 'phone',
    timestamp: '2025-10-15T14:30:00Z',
    performedBy: 'Robert Brown',
    metadata: { duration: 900, outcome: 'proposal_requested' },
  },
]

export const getSequenceStats = () => {
  const totalEnrolled = mockSequences.reduce((sum, s) => sum + s.enrolled, 0)
  const totalReplies = mockSequences.reduce((sum, s) => sum + s.replied, 0)
  const totalBooked = mockSequences.reduce((sum, s) => sum + s.booked, 0)
  
  return {
    totalSequences: mockSequences.length,
    activeSequences: mockSequences.filter(s => s.status === 'active').length,
    totalEnrolled,
    totalReplies,
    averageReplyRate: (totalReplies / totalEnrolled * 100).toFixed(1),
    totalBooked,
    averageBookingRate: (totalBooked / totalEnrolled * 100).toFixed(1),
  }
}

export const getEngagementStats = () => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const recentActivities = mockEngagementActivities.filter(a => a.timestamp > last24Hours)
  
  return {
    totalActivities: mockEngagementActivities.length,
    last24Hours: recentActivities.length,
    emailsSent: mockEngagementActivities.filter(a => a.type === 'email_sent').length,
    emailsOpened: mockEngagementActivities.filter(a => a.type === 'email_opened').length,
    emailsReplied: mockEngagementActivities.filter(a => a.type === 'email_replied').length,
    callsMade: mockEngagementActivities.filter(a => a.type === 'call_made').length,
    meetingsBooked: mockEngagementActivities.filter(a => a.type === 'meeting_booked').length,
  }
}

