'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Calendar, Send, Library, Sparkles, Image as ImageIcon, Smile } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AIPromptBuilder } from '@/components/marketing/ai-prompt-builder'
import { PlatformSelector } from '@/components/marketing/platform-selector'
import { PostPreview } from '@/components/marketing/post-preview'
import { EngagementMeter } from '@/components/marketing/engagement-meter'
import { HashtagInput } from '@/components/marketing/hashtag-input'
import { PlatformType } from '@/lib/mock-data/marketing-platforms'
import { toast } from 'react-hot-toast'

export default function PostCreationPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(['instagram'])
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [mediaUrls] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [engagementScore, setEngagementScore] = useState(75)

  const handleAIGenerate = async (config: any) => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const generatedContent = generateMockContent(config)
      setContent(generatedContent.text)
      setHashtags(generatedContent.hashtags)
      setEngagementScore(Math.floor(Math.random() * 30) + 70)
      setIsGenerating(false)
      toast.success('Content generated successfully!')
    }, 2000)
  }

  const handleImprove = () => {
    toast.loading('Improving content...')
    setTimeout(() => {
      setContent(content + '\n\nImproved with AI suggestions!')
      setEngagementScore(Math.min(engagementScore + 10, 100))
      toast.success('Content improved!')
    }, 1500)
  }

  const handleShorten = () => {
    const words = content.split(' ')
    if (words.length > 10) {
      setContent(words.slice(0, Math.floor(words.length * 0.7)).join(' ') + '...')
      toast.success('Content shortened!')
    }
  }

  const handleExpand = () => {
    setContent(content + '\n\nLet me know your thoughts in the comments below! 👇')
    toast.success('Content expanded!')
  }

  const handleSaveDraft = () => {
    toast.success('Post saved as draft!')
  }

  const handleSchedule = () => {
    toast.success('Redirecting to scheduler...')
    // In real app, would redirect to scheduler
  }

  const handlePostNow = () => {
    if (!content.trim()) {
      toast.error('Please add some content first!')
      return
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform!')
      return
    }
    toast.success('Post published successfully!')
  }

  const handleSaveToLibrary = () => {
    toast.success('Content saved to library!')
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="AI Post Creation"
            description="Create engaging social media content with AI assistance"
          />
        </div>
        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Creation Studio */}
          <div className="space-y-6">
            {/* AI Generation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIPromptBuilder
                  onGenerate={handleAIGenerate}
                  loading={isGenerating}
                />
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Target Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformSelector
                  selected={selectedPlatforms}
                  onChange={setSelectedPlatforms}
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write your post content here... or use AI to generate it!"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] text-base"
                />

                {/* AI Enhancement Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImprove}
                    disabled={!content.trim()}
                  >
                    <Sparkles className="mr-2 h-3 w-3" />
                    Improve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShorten}
                    disabled={!content.trim()}
                  >
                    Shorten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExpand}
                    disabled={!content.trim()}
                  >
                    Expand
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!content.trim()}
                  >
                    <Smile className="mr-2 h-3 w-3" />
                    Add Emojis
                  </Button>
                </div>

                {/* Character Count */}
                {selectedPlatforms.length > 0 && content && (
                  <div className="text-xs text-muted-foreground">
                    {content.length} characters
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle>Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <HashtagInput
                  hashtags={hashtags}
                  onChange={setHashtags}
                />
              </CardContent>
            </Card>

            {/* Media Attachment */}
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Drag and drop images/videos here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="mr-2 h-3 w-3" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      <Library className="mr-2 h-3 w-3" />
                      From Library
                    </Button>
                    <Button variant="outline" size="sm">
                      <Sparkles className="mr-2 h-3 w-3" />
                      AI Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview & Insights */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <PostPreview
                content={content + (hashtags.length > 0 ? '\n\n' + hashtags.map(h => '#' + h).join(' ') : '')}
                platforms={selectedPlatforms}
                mediaUrls={mediaUrls}
              />
            </div>

            {/* Engagement Prediction */}
            {content.trim() && (
              <EngagementMeter score={engagementScore} />
            )}

            {/* Best Time Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best Times to Post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Today at 2:00 PM', 'Today at 7:00 PM', 'Tomorrow at 10:00 AM'].map((time, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent cursor-pointer"
                    >
                      <span className="text-sm font-medium">{time}</span>
                      <Badge variant="secondary">
                        {Math.floor(Math.random() * 20) + 80}% engagement
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform-Specific Tips */}
            {selectedPlatforms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Optimization Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Content length is optimal for {selectedPlatforms[0]}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">!</span>
                      <span>Consider adding 2-3 more hashtags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">i</span>
                      <span>Posts with images get 2.3x more engagement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <Card className="sticky bottom-4 shadow-lg">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={handleSaveToLibrary}>
                <Library className="mr-2 h-4 w-4" />
                Save to Library
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSchedule}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button onClick={handlePostNow}>
                <Send className="mr-2 h-4 w-4" />
                Post Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Mock content generator
function generateMockContent(config: any) {
  const templates = {
    professional: {
      text: "We're excited to share our latest innovation with you. This represents a significant step forward in our commitment to excellence and customer satisfaction. Learn more about how this can benefit your organization.",
      hashtags: ['Business', 'Innovation', 'Professional'],
    },
    casual: {
      text: "Hey everyone! 👋 Check out what we've been working on! We think you're going to love it. Let us know what you think in the comments! 😊",
      hashtags: ['Updates', 'Community', 'Excited'],
    },
    witty: {
      text: "Plot twist: We just made your life easier. You're welcome. 😎 No really, this new feature is going to change everything. Check it out!",
      hashtags: ['GameChanger', 'Innovation', 'MindBlown'],
    },
    inspirational: {
      text: "Success isn't about being the best. It's about being better than you were yesterday. Today, we're proud to introduce something that embodies this philosophy. Join us on this journey! ✨",
      hashtags: ['Inspiration', 'Growth', 'Success'],
    },
    educational: {
      text: "Did you know? The right tools can increase productivity by up to 40%. That's why we've developed this new solution. Here's what you need to know about maximizing its potential 📚",
      hashtags: ['Education', 'Tips', 'Learning'],
    },
  }

  return templates[config.tone as keyof typeof templates] || templates.professional
}

