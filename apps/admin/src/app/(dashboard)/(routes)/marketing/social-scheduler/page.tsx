'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Grid3x3, List, Clock, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react'
import { getPlatform } from '@/lib/mock-data/marketing-platforms'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SocialSchedulerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month')
  const stats = { scheduled: 12, published: 45, drafts: 8, failed: 2, avgEngagementRate: 5.8 }

  const scheduledPosts: any[] = []
  const draftPosts: any[] = []
  const failedPosts: any[] = []

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Social Scheduler"
            description="Manage and schedule your social media posts"
          />
          <Link href="/marketing/post-creation">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>
        <Separator />

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-3xl font-bold">{stats.scheduled}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-3xl font-bold">{stats.drafts}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold">{stats.published}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-3xl font-bold">{stats.avgEngagementRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* View Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(addDays(currentDate, view === 'month' ? -30 : view === 'week' ? -7 : -1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(addDays(currentDate, view === 'month' ? 30 : view === 'week' ? 7 : 1))}
                    >
                      Next
                    </Button>
                    <span className="ml-4 font-semibold">
                      {format(currentDate, 'MMMM yyyy')}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={view === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('month')}
                    >
                      <Grid3x3 className="h-4 w-4 mr-1" />
                      Month
                    </Button>
                    <Button
                      variant={view === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('week')}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Week
                    </Button>
                    <Button
                      variant={view === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('list')}
                    >
                      <List className="h-4 w-4 mr-1" />
                      List
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar View */}
            <Card>
              <CardContent className="p-4">
                {view === 'month' && <MonthView currentDate={currentDate} posts={scheduledPosts} />}
                {view === 'week' && <WeekView currentDate={currentDate} posts={scheduledPosts} />}
                {view === 'list' && <ListView posts={scheduledPosts} />}
              </CardContent>
            </Card>

            {/* Best Time Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Optimal Posting Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="text-xs font-medium mb-2">{day}</div>
                      <div className="space-y-1">
                        {['9AM', '2PM', '7PM'].map((time, j) => (
                          <div
                            key={time}
                            className={cn(
                              'text-xs py-1 rounded',
                              j === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Queue */}
          <div className="space-y-4">
            {/* Upcoming Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      {post.platforms.map((platformId) => {
                        const platform = getPlatform(platformId)
                        return (
                          <span key={platformId} className="text-lg">
                            {platform.icon}
                          </span>
                        )
                      })}
                    </div>
                    <p className="text-xs line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.scheduledFor && format(new Date(post.scheduledFor), 'MMM d, h:mm a')}</span>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Draft Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Drafts ({draftPosts.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {draftPosts.map((post) => (
                  <div key={post.id} className="p-2 border rounded text-xs space-y-1">
                    <p className="line-clamp-1 font-medium">{post.content}</p>
                    <p className="text-muted-foreground">{format(new Date(post.createdAt), 'MMM d')}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Failed Posts */}
            {failedPosts.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    Failed ({failedPosts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {failedPosts.map((post) => (
                    <div key={post.id} className="p-2 border border-red-200 rounded text-xs space-y-1">
                      <p className="line-clamp-1 font-medium">{post.content}</p>
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        Retry
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Month View Component
function MonthView({ currentDate, posts }: { currentDate: Date; posts: any[] }) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="space-y-2">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const dayPosts = posts.filter(post =>
            post.scheduledFor && isSameDay(new Date(post.scheduledFor), day)
          )
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={i}
              className={cn(
                'min-h-[100px] p-2 border rounded-lg',
                !isCurrentMonth && 'bg-muted/50',
                isToday && 'border-primary border-2'
              )}
            >
              <div className={cn(
                'text-sm font-medium mb-1',
                !isCurrentMonth && 'text-muted-foreground',
                isToday && 'text-primary'
              )}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayPosts.slice(0, 2).map((post) => (
                  <div key={post.id} className="text-xs p-1 bg-blue-100 rounded truncate">
                    {post.platforms.map(p => getPlatform(p).icon).join('')}
                  </div>
                ))}
                {dayPosts.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayPosts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Week View Component
function WeekView({ currentDate, posts }: { currentDate: Date; posts: any[] }) {
  const weekStart = startOfWeek(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="space-y-2 overflow-x-auto">
      <div className="grid grid-cols-8 gap-2 min-w-[800px]">
        <div className="text-sm font-medium">Time</div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-sm font-medium text-center">
            <div>{format(day, 'EEE')}</div>
            <div className="text-xs text-muted-foreground">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-8 gap-2 min-w-[800px]">
          <div className="text-xs text-muted-foreground py-2">
            {format(new Date().setHours(hour, 0), 'h:mm a')}
          </div>
          {weekDays.map((day) => {
            const dayHourPosts = posts.filter(post => {
              if (!post.scheduledFor) return false
              const postDate = new Date(post.scheduledFor)
              return isSameDay(postDate, day) && postDate.getHours() === hour
            })

            return (
              <div key={day.toISOString()} className="border rounded p-1 min-h-[60px]">
                {dayHourPosts.slice(0, 1).map((post) => (
                  <div key={post.id} className="text-xs bg-blue-100 p-1 rounded">
                    {post.platforms.map(p => getPlatform(p).icon).join('')}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// List View Component
function ListView({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent">
          <div className="flex gap-1">
            {post.platforms.map((platformId) => {
              const platform = getPlatform(platformId)
              return (
                <span key={platformId} className="text-xl">
                  {platform.icon}
                </span>
              )
            })}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium line-clamp-1">{post.content}</p>
            <p className="text-xs text-muted-foreground">
              {post.hashtags.slice(0, 3).map(h => '#' + h).join(' ')}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {post.scheduledFor && format(new Date(post.scheduledFor), 'MMM d, h:mm a')}
          </div>
          <Badge variant="secondary">Scheduled</Badge>
          <Button size="sm" variant="outline">Edit</Button>
        </div>
      ))}
    </div>
  )
}

