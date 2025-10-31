export type PlatformType = 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok'

export interface Platform {
  id: PlatformType
  name: string
  color: string
  icon: string
  charLimit: number
  hashtagLimit: number
  imageSpecs: {
    square: string
    portrait: string
    landscape: string
  }
  bestTimes: string[]
  features: string[]
}

export const platforms: Record<PlatformType, Platform> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: 'from-purple-600 via-pink-600 to-orange-500',
    icon: '📷',
    charLimit: 2200,
    hashtagLimit: 30,
    imageSpecs: {
      square: '1080x1080',
      portrait: '1080x1350',
      landscape: '1080x566',
    },
    bestTimes: ['9:00 AM', '11:00 AM', '2:00 PM', '7:00 PM'],
    features: ['Stories', 'Reels', 'Feed Posts', 'Carousel'],
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    color: 'from-blue-400 to-blue-600',
    icon: '🐦',
    charLimit: 280,
    hashtagLimit: 10,
    imageSpecs: {
      square: '1200x1200',
      portrait: '1200x1500',
      landscape: '1200x675',
    },
    bestTimes: ['8:00 AM', '12:00 PM', '5:00 PM', '9:00 PM'],
    features: ['Tweets', 'Threads', 'Polls'],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: 'from-blue-600 to-blue-800',
    icon: '💼',
    charLimit: 3000,
    hashtagLimit: 30,
    imageSpecs: {
      square: '1200x1200',
      portrait: '1200x1500',
      landscape: '1200x627',
    },
    bestTimes: ['7:00 AM', '10:00 AM', '12:00 PM', '5:00 PM'],
    features: ['Posts', 'Articles', 'Polls', 'Documents'],
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: 'from-blue-500 to-blue-700',
    icon: '👍',
    charLimit: 63206,
    hashtagLimit: 30,
    imageSpecs: {
      square: '1200x1200',
      portrait: '1200x1500',
      landscape: '1200x630',
    },
    bestTimes: ['9:00 AM', '1:00 PM', '3:00 PM', '8:00 PM'],
    features: ['Posts', 'Stories', 'Live', 'Events'],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: 'from-pink-500 to-cyan-500',
    icon: '🎵',
    charLimit: 2200,
    hashtagLimit: 30,
    imageSpecs: {
      square: '1080x1080',
      portrait: '1080x1920',
      landscape: '1920x1080',
    },
    bestTimes: ['6:00 AM', '10:00 AM', '7:00 PM', '11:00 PM'],
    features: ['Videos', 'Duets', 'Stitches', 'Live'],
  },
}

export const getPlatform = (id: PlatformType) => platforms[id]

export const getAllPlatforms = () => Object.values(platforms)

