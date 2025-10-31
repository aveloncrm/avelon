import { PlatformType } from './marketing-platforms'

export interface AnalyticsMetrics {
  date: string
  reach: number
  impressions: number
  engagement: number
  engagementRate: number
  clicks: number
  followers: number
  followerGrowth: number
}

export interface PlatformMetrics {
  platform: PlatformType
  reach: number
  impressions: number
  engagement: number
  engagementRate: number
  followers: number
  topPost: {
    id: string
    content: string
    engagement: number
  }
}

export interface ContentPerformance {
  type: string
  count: number
  avgEngagement: number
  totalReach: number
}

export interface HashtagPerformance {
  hashtag: string
  uses: number
  reach: number
  engagement: number
  engagementRate: number
}

export interface AudienceDemographics {
  ageRange: string
  percentage: number
}

export interface AudienceLocation {
  country: string
  percentage: number
}

export const mockTimeSeriesData: AnalyticsMetrics[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  const baseReach = 15000 + Math.random() * 10000
  const baseEngagement = baseReach * (0.03 + Math.random() * 0.04)
  
  return {
    date: date.toISOString().split('T')[0],
    reach: Math.floor(baseReach),
    impressions: Math.floor(baseReach * 2.5),
    engagement: Math.floor(baseEngagement),
    engagementRate: parseFloat(((baseEngagement / baseReach) * 100).toFixed(2)),
    clicks: Math.floor(baseEngagement * 0.3),
    followers: 45000 + i * 50 + Math.floor(Math.random() * 100),
    followerGrowth: Math.floor(Math.random() * 150),
  }
})

export const mockPlatformMetrics: PlatformMetrics[] = [
  {
    platform: 'instagram',
    reach: 180000,
    impressions: 425000,
    engagement: 18500,
    engagementRate: 4.4,
    followers: 28500,
    topPost: {
      id: '1',
      content: '🚀 Excited to announce our new product launch!',
      engagement: 1850,
    },
  },
  {
    platform: 'linkedin',
    reach: 125000,
    impressions: 285000,
    engagement: 12800,
    engagementRate: 4.5,
    followers: 18200,
    topPost: {
      id: '6',
      content: '🌟 Customer success story: How @TechCorp increased their ROI by 300%',
      engagement: 1620,
    },
  },
  {
    platform: 'twitter',
    reach: 95000,
    impressions: 215000,
    engagement: 8200,
    engagementRate: 3.8,
    followers: 15800,
    topPost: {
      id: '2',
      content: '💡 Pro tip: Boost your productivity by 10x',
      engagement: 980,
    },
  },
  {
    platform: 'facebook',
    reach: 68000,
    impressions: 142000,
    engagement: 5100,
    engagementRate: 3.6,
    followers: 22400,
    topPost: {
      id: '3',
      content: '🎉 Join us for our exclusive webinar!',
      engagement: 750,
    },
  },
  {
    platform: 'tiktok',
    reach: 42000,
    impressions: 98000,
    engagement: 3800,
    engagementRate: 3.9,
    followers: 8900,
    topPost: {
      id: '4',
      content: '✨ Behind the scenes at our office!',
      engagement: 520,
    },
  },
]

export const mockContentPerformance: ContentPerformance[] = [
  {
    type: 'Video',
    count: 12,
    avgEngagement: 2850,
    totalReach: 185000,
  },
  {
    type: 'Image',
    count: 45,
    avgEngagement: 1240,
    totalReach: 420000,
  },
  {
    type: 'Carousel',
    count: 18,
    avgEngagement: 1680,
    totalReach: 295000,
  },
  {
    type: 'Text',
    count: 28,
    avgEngagement: 890,
    totalReach: 165000,
  },
  {
    type: 'Link',
    count: 22,
    avgEngagement: 1120,
    totalReach: 185000,
  },
]

export const mockHashtagPerformance: HashtagPerformance[] = [
  { hashtag: '#ProductLaunch', uses: 15, reach: 125000, engagement: 8500, engagementRate: 6.8 },
  { hashtag: '#AI', uses: 28, reach: 245000, engagement: 12800, engagementRate: 5.2 },
  { hashtag: '#Innovation', uses: 22, reach: 185000, engagement: 9200, engagementRate: 5.0 },
  { hashtag: '#Marketing', uses: 18, reach: 142000, engagement: 6800, engagementRate: 4.8 },
  { hashtag: '#BusinessTips', uses: 12, reach: 98000, engagement: 5100, engagementRate: 5.2 },
  { hashtag: '#Productivity', uses: 14, reach: 115000, engagement: 6200, engagementRate: 5.4 },
  { hashtag: '#Tech', uses: 25, reach: 198000, engagement: 9500, engagementRate: 4.8 },
  { hashtag: '#Success', uses: 16, reach: 128000, engagement: 6400, engagementRate: 5.0 },
]

export const mockAudienceDemographics: AudienceDemographics[] = [
  { ageRange: '18-24', percentage: 15 },
  { ageRange: '25-34', percentage: 38 },
  { ageRange: '35-44', percentage: 28 },
  { ageRange: '45-54', percentage: 12 },
  { ageRange: '55+', percentage: 7 },
]

export const mockAudienceLocations: AudienceLocation[] = [
  { country: 'United States', percentage: 42 },
  { country: 'United Kingdom', percentage: 18 },
  { country: 'Canada', percentage: 12 },
  { country: 'Australia', percentage: 8 },
  { country: 'Germany', percentage: 7 },
  { country: 'France', percentage: 5 },
  { country: 'Others', percentage: 8 },
]

export const mockActiveHoursData = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${hour}:00`,
  activity: Math.floor(Math.random() * 100),
}))

export const mockWeekdayActivity = [
  { day: 'Monday', posts: 8, engagement: 2400 },
  { day: 'Tuesday', posts: 12, engagement: 3200 },
  { day: 'Wednesday', posts: 10, engagement: 2800 },
  { day: 'Thursday', posts: 14, engagement: 3800 },
  { day: 'Friday', posts: 11, engagement: 3100 },
  { day: 'Saturday', posts: 6, engagement: 1800 },
  { day: 'Sunday', posts: 5, engagement: 1500 },
]

export const getOverallMetrics = () => {
  const latest = mockTimeSeriesData[mockTimeSeriesData.length - 1]
  const previous = mockTimeSeriesData[mockTimeSeriesData.length - 8]
  
  const totalReach = mockPlatformMetrics.reduce((sum, p) => sum + p.reach, 0)
  const totalEngagement = mockPlatformMetrics.reduce((sum, p) => sum + p.engagement, 0)
  const avgEngagementRate = mockPlatformMetrics.reduce((sum, p) => sum + p.engagementRate, 0) / mockPlatformMetrics.length
  const totalFollowers = mockPlatformMetrics.reduce((sum, p) => sum + p.followers, 0)
  
  return {
    reach: totalReach,
    reachGrowth: ((latest.reach - previous.reach) / previous.reach * 100).toFixed(1),
    engagement: totalEngagement,
    engagementGrowth: ((totalEngagement - 42000) / 42000 * 100).toFixed(1),
    engagementRate: avgEngagementRate.toFixed(1),
    engagementRateChange: 0.3,
    followers: totalFollowers,
    followerGrowth: ((totalFollowers - 92000) / 92000 * 100).toFixed(1),
    bestPlatform: mockPlatformMetrics.sort((a, b) => b.engagementRate - a.engagementRate)[0].platform,
    avgPostPerformance: (totalEngagement / 103).toFixed(0),
    topContentType: 'Video',
  }
}

