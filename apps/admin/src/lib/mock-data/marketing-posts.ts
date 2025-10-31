import { PlatformType } from './marketing-platforms'

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface SocialPost {
  id: string
  content: string
  platforms: PlatformType[]
  status: PostStatus
  scheduledFor?: string
  publishedAt?: string
  mediaUrls: string[]
  hashtags: string[]
  engagement?: {
    likes: number
    comments: number
    shares: number
    views: number
    engagementRate: number
  }
  aiGenerated: boolean
  campaignId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export const mockPosts: SocialPost[] = [
  {
    id: '1',
    content: '🚀 Excited to announce our new product launch! Revolutionizing the way you work with AI. Stay tuned for more updates! #ProductLaunch #Innovation #AI',
    platforms: ['instagram', 'twitter', 'linkedin'],
    status: 'published',
    publishedAt: '2025-10-15T10:00:00Z',
    mediaUrls: ['/mock-images/product-launch.jpg'],
    hashtags: ['ProductLaunch', 'Innovation', 'AI'],
    engagement: {
      likes: 342,
      comments: 45,
      shares: 28,
      views: 5420,
      engagementRate: 7.6,
    },
    aiGenerated: true,
    campaignId: '1',
    createdBy: 'Sarah Johnson',
    createdAt: '2025-10-14T15:00:00Z',
    updatedAt: '2025-10-15T10:00:00Z',
  },
  {
    id: '2',
    content: '💡 Pro tip: Boost your productivity by 10x with these simple strategies. Thread 🧵👇 #Productivity #BusinessTips',
    platforms: ['twitter', 'linkedin'],
    status: 'published',
    publishedAt: '2025-10-16T09:00:00Z',
    mediaUrls: [],
    hashtags: ['Productivity', 'BusinessTips'],
    engagement: {
      likes: 189,
      comments: 34,
      shares: 52,
      views: 3200,
      engagementRate: 8.6,
    },
    aiGenerated: false,
    createdBy: 'Mike Chen',
    createdAt: '2025-10-15T14:00:00Z',
    updatedAt: '2025-10-16T09:00:00Z',
  },
  {
    id: '3',
    content: '🎉 Join us for our exclusive webinar on AI in Marketing! Limited spots available. Register now! Link in bio. #Webinar #AIMarketing #LearnWithUs',
    platforms: ['instagram', 'facebook', 'linkedin'],
    status: 'scheduled',
    scheduledFor: '2025-10-20T14:00:00Z',
    mediaUrls: ['/mock-images/webinar.jpg'],
    hashtags: ['Webinar', 'AIMarketing', 'LearnWithUs'],
    aiGenerated: true,
    campaignId: '2',
    createdBy: 'Emma Davis',
    createdAt: '2025-10-17T10:00:00Z',
    updatedAt: '2025-10-17T10:00:00Z',
  },
  {
    id: '4',
    content: '✨ Behind the scenes at our office! Our team is working hard to bring you the best experience. #TeamWork #CompanyCulture #OfficeLife',
    platforms: ['instagram', 'tiktok'],
    status: 'draft',
    mediaUrls: ['/mock-images/office-1.jpg', '/mock-images/office-2.jpg'],
    hashtags: ['TeamWork', 'CompanyCulture', 'OfficeLife'],
    aiGenerated: false,
    createdBy: 'John Smith',
    createdAt: '2025-10-17T11:30:00Z',
    updatedAt: '2025-10-17T11:30:00Z',
  },
  {
    id: '5',
    content: '🔥 Flash Sale Alert! 50% off on all premium plans this weekend only. Don\'t miss out! #Sale #LimitedOffer #Premium',
    platforms: ['twitter', 'facebook', 'instagram'],
    status: 'scheduled',
    scheduledFor: '2025-10-19T08:00:00Z',
    mediaUrls: ['/mock-images/sale.jpg'],
    hashtags: ['Sale', 'LimitedOffer', 'Premium'],
    aiGenerated: true,
    campaignId: '3',
    createdBy: 'Sarah Johnson',
    createdAt: '2025-10-17T09:00:00Z',
    updatedAt: '2025-10-17T09:00:00Z',
  },
  {
    id: '6',
    content: '🌟 Customer success story: How @TechCorp increased their ROI by 300% using our platform. Read the full case study! #CaseStudy #Success #ROI',
    platforms: ['linkedin', 'twitter'],
    status: 'published',
    publishedAt: '2025-10-14T11:00:00Z',
    mediaUrls: ['/mock-images/case-study.jpg'],
    hashtags: ['CaseStudy', 'Success', 'ROI'],
    engagement: {
      likes: 567,
      comments: 89,
      shares: 145,
      views: 8900,
      engagementRate: 9.0,
    },
    aiGenerated: false,
    campaignId: '1',
    createdBy: 'Mike Chen',
    createdAt: '2025-10-13T16:00:00Z',
    updatedAt: '2025-10-14T11:00:00Z',
  },
  {
    id: '7',
    content: '📊 New blog post: 10 Data-Driven Marketing Strategies for 2025. Check it out and let us know your thoughts! #Marketing #DataDriven #Blog',
    platforms: ['linkedin', 'facebook'],
    status: 'scheduled',
    scheduledFor: '2025-10-18T10:00:00Z',
    mediaUrls: ['/mock-images/blog-preview.jpg'],
    hashtags: ['Marketing', 'DataDriven', 'Blog'],
    aiGenerated: true,
    createdBy: 'Emma Davis',
    createdAt: '2025-10-17T13:00:00Z',
    updatedAt: '2025-10-17T13:00:00Z',
  },
  {
    id: '8',
    content: '🎯 Monday Motivation: "The only way to do great work is to love what you do." - Steve Jobs #MondayMotivation #Inspiration #Success',
    platforms: ['instagram', 'twitter', 'linkedin'],
    status: 'failed',
    scheduledFor: '2025-10-14T08:00:00Z',
    mediaUrls: ['/mock-images/motivation.jpg'],
    hashtags: ['MondayMotivation', 'Inspiration', 'Success'],
    aiGenerated: false,
    createdBy: 'John Smith',
    createdAt: '2025-10-13T20:00:00Z',
    updatedAt: '2025-10-14T08:05:00Z',
  },
]

export const getPostsByStatus = (status: PostStatus) => {
  return mockPosts.filter(post => post.status === status)
}

export const getPostById = (id: string) => {
  return mockPosts.find(post => post.id === id)
}

export const getPostStats = () => {
  const published = mockPosts.filter(p => p.status === 'published')
  const totalEngagement = published.reduce((sum, p) => {
    if (p.engagement) {
      return sum + p.engagement.likes + p.engagement.comments + p.engagement.shares
    }
    return sum
  }, 0)
  
  const avgEngagementRate = published.reduce((sum, p) => {
    return sum + (p.engagement?.engagementRate || 0)
  }, 0) / published.length || 0

  return {
    total: mockPosts.length,
    draft: mockPosts.filter(p => p.status === 'draft').length,
    scheduled: mockPosts.filter(p => p.status === 'scheduled').length,
    published: published.length,
    failed: mockPosts.filter(p => p.status === 'failed').length,
    totalEngagement,
    avgEngagementRate: avgEngagementRate.toFixed(1),
    aiGenerated: mockPosts.filter(p => p.aiGenerated).length,
  }
}

