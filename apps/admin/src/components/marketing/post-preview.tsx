'use client'

import { PlatformType, getPlatform } from '@/lib/mock-data/marketing-platforms'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

interface PostPreviewProps {
  content: string
  platforms: PlatformType[]
  mediaUrls?: string[]
  className?: string
}

export function PostPreview({ content, platforms, mediaUrls = [], className }: PostPreviewProps) {
  if (platforms.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Select a platform to see preview
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <Tabs defaultValue={platforms[0]} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}>
            {platforms.map((platformId) => {
              const platform = getPlatform(platformId)
              return (
                <TabsTrigger key={platformId} value={platformId}>
                  <span className="mr-1">{platform.icon}</span>
                  {platform.name}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {platforms.map((platformId) => {
            const platform = getPlatform(platformId)
            return (
              <TabsContent key={platformId} value={platformId} className="mt-4">
                <div className="space-y-4">
                  {/* Preview based on platform */}
                  {platformId === 'instagram' && (
                    <InstagramPreview content={content} mediaUrls={mediaUrls} />
                  )}
                  {platformId === 'twitter' && (
                    <TwitterPreview content={content} mediaUrls={mediaUrls} />
                  )}
                  {platformId === 'linkedin' && (
                    <LinkedInPreview content={content} mediaUrls={mediaUrls} />
                  )}
                  {platformId === 'facebook' && (
                    <FacebookPreview content={content} mediaUrls={mediaUrls} />
                  )}
                  {platformId === 'tiktok' && (
                    <TikTokPreview content={content} mediaUrls={mediaUrls} />
                  )}

                  {/* Character count */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Character count: {content.length}/{platform.charLimit}</span>
                    {content.length > platform.charLimit && (
                      <span className="text-red-600 font-medium">Exceeds limit!</span>
                    )}
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function InstagramPreview({ content, mediaUrls }: { content: string; mediaUrls: string[] }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-3 flex items-center gap-2 border-b">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500" />
        <div>
          <p className="font-semibold text-sm">your_account</p>
        </div>
      </div>
      {mediaUrls.length > 0 && (
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-muted-foreground">Post Image</span>
        </div>
      )}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-4">
          <Heart className="h-6 w-6" />
          <MessageCircle className="h-6 w-6" />
          <Share2 className="h-6 w-6" />
          <Bookmark className="h-6 w-6 ml-auto" />
        </div>
        <p className="text-sm">
          <span className="font-semibold mr-2">your_account</span>
          {content}
        </p>
      </div>
    </div>
  )
}

function TwitterPreview({ content, mediaUrls }: { content: string; mediaUrls: string[] }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">Your Name</span>
            <span className="text-muted-foreground">@youraccount</span>
            <span className="text-muted-foreground">· 2m</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
          {mediaUrls.length > 0 && (
            <div className="rounded-lg border aspect-video bg-gray-100 flex items-center justify-center">
              <span className="text-muted-foreground">Post Image</span>
            </div>
          )}
          <div className="flex items-center gap-8 pt-2 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <Share2 className="h-4 w-4" />
            <Heart className="h-4 w-4" />
            <Bookmark className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkedInPreview({ content, mediaUrls }: { content: string; mediaUrls: string[] }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 flex items-start gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Your Name</p>
          <p className="text-xs text-muted-foreground">Job Title • 2m</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
      {mediaUrls.length > 0 && (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <span className="text-muted-foreground">Post Image</span>
        </div>
      )}
      <div className="p-4 border-t flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" /> Like
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" /> Comment
        </span>
        <span className="flex items-center gap-1">
          <Share2 className="h-4 w-4" /> Share
        </span>
      </div>
    </div>
  )
}

function FacebookPreview({ content, mediaUrls }: { content: string; mediaUrls: string[] }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-600" />
        <div>
          <p className="font-semibold text-sm">Your Page</p>
          <p className="text-xs text-muted-foreground">Just now · 🌍</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
      {mediaUrls.length > 0 && (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <span className="text-muted-foreground">Post Image</span>
        </div>
      )}
      <div className="p-2 border-t flex items-center justify-around text-sm text-muted-foreground">
        <span className="flex items-center gap-1 py-2">
          <Heart className="h-4 w-4" /> Like
        </span>
        <span className="flex items-center gap-1 py-2">
          <MessageCircle className="h-4 w-4" /> Comment
        </span>
        <span className="flex items-center gap-1 py-2">
          <Share2 className="h-4 w-4" /> Share
        </span>
      </div>
    </div>
  )
}

function TikTokPreview({ content }: { content: string; mediaUrls: string[] }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-black text-white">
      <div className="aspect-[9/16] relative bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center">
        <span className="text-white/80">Video Preview</span>
      </div>
      <div className="p-4 space-y-2">
        <p className="font-semibold">@youraccount</p>
        <p className="text-sm">{content}</p>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" /> 0
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> 0
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-4 w-4" /> 0
          </span>
        </div>
      </div>
    </div>
  )
}

