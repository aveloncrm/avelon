export type MediaType = 'image' | 'video' | 'document' | 'template'
export type ContentStatus = 'active' | 'archived'

export interface ContentAsset {
  id: string
  name: string
  description: string
  type: MediaType
  url: string
  thumbnail: string
  dimensions?: {
    width: number
    height: number
  }
  fileSize: number
  format: string
  tags: string[]
  collections: string[]
  uploadedBy: string
  uploadedAt: string
  usageCount: number
  performanceScore?: number
  status: ContentStatus
  aiGenerated: boolean
  metadata: {
    altText?: string
    copyright?: string
    source?: string
  }
}

export const mockContentAssets: ContentAsset[] = [
  {
    id: '1',
    name: 'Product Launch Hero Image',
    description: 'Main hero image for product launch campaign',
    type: 'image',
    url: '/mock-images/product-hero.jpg',
    thumbnail: '/mock-images/thumbs/product-hero.jpg',
    dimensions: { width: 1920, height: 1080 },
    fileSize: 2458000,
    format: 'JPG',
    tags: ['product', 'launch', 'hero', 'main'],
    collections: ['Product Launch', 'Hero Images'],
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-09-20T10:00:00Z',
    usageCount: 12,
    performanceScore: 92,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'Modern AI-powered platform dashboard on laptop screen',
      copyright: '© 2025 Company',
      source: 'Professional photoshoot',
    },
  },
  {
    id: '2',
    name: 'Team Collaboration Photo',
    description: 'Team working together in modern office space',
    type: 'image',
    url: '/mock-images/team-collab.jpg',
    thumbnail: '/mock-images/thumbs/team-collab.jpg',
    dimensions: { width: 1200, height: 800 },
    fileSize: 1856000,
    format: 'JPG',
    tags: ['team', 'office', 'collaboration', 'people'],
    collections: ['Company Culture', 'Team Photos'],
    uploadedBy: 'John Smith',
    uploadedAt: '2025-09-15T14:30:00Z',
    usageCount: 8,
    performanceScore: 85,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'Diverse team collaborating around a conference table',
      copyright: '© 2025 Company',
    },
  },
  {
    id: '3',
    name: 'Product Demo Video',
    description: '60-second product demonstration video',
    type: 'video',
    url: '/mock-videos/product-demo.mp4',
    thumbnail: '/mock-images/thumbs/video-demo.jpg',
    dimensions: { width: 1920, height: 1080 },
    fileSize: 45600000,
    format: 'MP4',
    tags: ['video', 'demo', 'product', 'tutorial'],
    collections: ['Product Content', 'Video Library'],
    uploadedBy: 'Mike Chen',
    uploadedAt: '2025-10-01T09:00:00Z',
    usageCount: 15,
    performanceScore: 96,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'Product demonstration showing key features',
    },
  },
  {
    id: '4',
    name: 'Infographic Template',
    description: 'Reusable infographic template for statistics',
    type: 'template',
    url: '/mock-templates/infographic.psd',
    thumbnail: '/mock-images/thumbs/infographic.jpg',
    dimensions: { width: 1080, height: 1920 },
    fileSize: 12400000,
    format: 'PSD',
    tags: ['template', 'infographic', 'statistics', 'design'],
    collections: ['Templates', 'Design Assets'],
    uploadedBy: 'Emma Davis',
    uploadedAt: '2025-09-10T11:00:00Z',
    usageCount: 24,
    performanceScore: 88,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'Infographic template with data visualization elements',
    },
  },
  {
    id: '5',
    name: 'AI Generated Abstract Background',
    description: 'Colorful abstract background for social media',
    type: 'image',
    url: '/mock-images/ai-abstract.jpg',
    thumbnail: '/mock-images/thumbs/ai-abstract.jpg',
    dimensions: { width: 1080, height: 1080 },
    fileSize: 890000,
    format: 'JPG',
    tags: ['abstract', 'background', 'colorful', 'ai-generated'],
    collections: ['AI Generated', 'Backgrounds'],
    uploadedBy: 'AI Generator',
    uploadedAt: '2025-10-05T16:20:00Z',
    usageCount: 6,
    performanceScore: 78,
    status: 'active',
    aiGenerated: true,
    metadata: {
      altText: 'Colorful abstract gradient background',
      source: 'AI Image Generator',
    },
  },
  {
    id: '6',
    name: 'Case Study PDF',
    description: 'Customer success case study document',
    type: 'document',
    url: '/mock-docs/case-study-techcorp.pdf',
    thumbnail: '/mock-images/thumbs/case-study.jpg',
    fileSize: 3450000,
    format: 'PDF',
    tags: ['case-study', 'customer-success', 'document'],
    collections: ['Case Studies', 'Sales Collateral'],
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-09-25T10:00:00Z',
    usageCount: 18,
    performanceScore: 91,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'TechCorp case study PDF document',
    },
  },
  {
    id: '7',
    name: 'Holiday Sale Banner',
    description: 'Promotional banner for holiday sale',
    type: 'image',
    url: '/mock-images/holiday-sale.jpg',
    thumbnail: '/mock-images/thumbs/holiday-sale.jpg',
    dimensions: { width: 1200, height: 628 },
    fileSize: 1120000,
    format: 'JPG',
    tags: ['sale', 'holiday', 'promotion', 'banner'],
    collections: ['Promotional', 'Seasonal'],
    uploadedBy: 'Mike Chen',
    uploadedAt: '2025-10-12T13:00:00Z',
    usageCount: 3,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'Holiday sale promotional banner with 50% off text',
    },
  },
  {
    id: '8',
    name: 'Quote Card Template',
    description: 'Social media quote card template',
    type: 'template',
    url: '/mock-templates/quote-card.fig',
    thumbnail: '/mock-images/thumbs/quote-card.jpg',
    dimensions: { width: 1080, height: 1080 },
    fileSize: 5600000,
    format: 'FIG',
    tags: ['template', 'quote', 'social-media', 'design'],
    collections: ['Templates', 'Social Media'],
    uploadedBy: 'Emma Davis',
    uploadedAt: '2025-09-18T09:30:00Z',
    usageCount: 32,
    performanceScore: 94,
    status: 'active',
    aiGenerated: false,
    metadata: {
      altText: 'Inspirational quote card template',
    },
  },
]

export const getContentByType = (type: MediaType) => {
  return mockContentAssets.filter(asset => asset.type === type)
}

export const getContentById = (id: string) => {
  return mockContentAssets.find(asset => asset.id === id)
}

export const getContentStats = () => {
  const avgPerformance = mockContentAssets
    .filter(a => a.performanceScore)
    .reduce((sum, a) => sum + (a.performanceScore || 0), 0) / mockContentAssets.filter(a => a.performanceScore).length

  return {
    total: mockContentAssets.length,
    images: mockContentAssets.filter(a => a.type === 'image').length,
    videos: mockContentAssets.filter(a => a.type === 'video').length,
    documents: mockContentAssets.filter(a => a.type === 'document').length,
    templates: mockContentAssets.filter(a => a.type === 'template').length,
    aiGenerated: mockContentAssets.filter(a => a.aiGenerated).length,
    avgPerformance: avgPerformance.toFixed(0),
    totalUsage: mockContentAssets.reduce((sum, a) => sum + a.usageCount, 0),
  }
}

