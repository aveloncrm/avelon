'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Download, TrendingUp, Users, BarChart3,
  Eye, Heart, MessageSquare, Share2, Target, Award, Lightbulb, AlertCircle
} from 'lucide-react'
import {
  getOverallMetrics,
  mockPlatformMetrics,
  mockContentPerformance,
  mockHashtagPerformance,
  mockAudienceDemographics,
  mockAudienceLocations,
  mockWeekdayActivity
} from '@/lib/mock-data/marketing-analytics'
import { getPlatform } from '@/lib/mock-data/marketing-platforms'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export default function MarketingAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  // const [platformFilter, setPlatformFilter] = useState('all')

  const metrics = getOverallMetrics()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Marketing Analytics"
            description="Track and analyze your social media performance"
          />
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        <Separator />

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                  <p className="text-3xl font-bold">{(metrics.reach / 1000).toFixed(0)}K</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{metrics.reachGrowth}%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-3xl font-bold">{metrics.engagementRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{metrics.engagementRateChange}%</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                  <p className="text-3xl font-bold">{(metrics.followers / 1000).toFixed(1)}K</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{metrics.followerGrowth}%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Platform</p>
                  <p className="text-2xl font-bold capitalize">{metrics.bestPlatform}</p>
                  <p className="text-xs text-muted-foreground mt-1">Highest engagement</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Analytics Area */}
          <div className="lg:col-span-3 space-y-4">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Platform Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPlatformMetrics.map((platform) => {
                        const platformInfo = getPlatform(platform.platform)
                        return (
                          <div key={platform.platform} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{platformInfo.icon}</span>
                                <span className="font-medium">{platformInfo.name}</span>
                              </div>
                              <span className="text-sm font-semibold">{platform.engagementRate}%</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Reach</p>
                                <p className="font-semibold">{(platform.reach / 1000).toFixed(0)}K</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Engagement</p>
                                <p className="font-semibold">{(platform.engagement / 1000).toFixed(1)}K</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Followers</p>
                                <p className="font-semibold">{(platform.followers / 1000).toFixed(1)}K</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Rate</p>
                                <p className="font-semibold text-green-600">{platform.engagementRate}%</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Type Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Type Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockContentPerformance.map((content) => (
                        <div key={content.type} className="flex items-center gap-4">
                          <div className="w-24 text-sm font-medium">{content.type}</div>
                          <div className="flex-1">
                            <div className="h-8 bg-muted rounded-md overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center px-3 text-white text-sm"
                                style={{ width: `${(content.avgEngagement / 3000) * 100}%` }}
                              >
                                {content.avgEngagement}
                              </div>
                            </div>
                          </div>
                          <div className="w-24 text-sm text-right">
                            <div className="font-semibold">{content.count} posts</div>
                            <div className="text-muted-foreground">{(content.totalReach / 1000).toFixed(0)}K reach</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Publishing Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publishing Activity by Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockWeekdayActivity.map((day) => (
                        <div key={day.day} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium">{day.day}</div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${(day.posts / 14) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm w-16">{day.posts} posts</span>
                          </div>
                          <div className="text-sm text-muted-foreground w-24 text-right">
                            {(day.engagement / 1000).toFixed(1)}K engagement
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockAudienceDemographics.map((demo) => (
                          <div key={demo.ageRange} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{demo.ageRange}</span>
                              <span className="text-muted-foreground">{demo.percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${demo.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Locations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockAudienceLocations.map((location) => (
                          <div key={location.country} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{location.country}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{ width: `${location.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-right">
                                {location.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                {/* Hashtag Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockHashtagPerformance.map((hashtag, i) => (
                        <div key={hashtag.hashtag} className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{hashtag.hashtag}</span>
                              <span className="text-sm text-muted-foreground">
                                {hashtag.uses} uses
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{(hashtag.reach / 1000).toFixed(0)}K reach</span>
                              <span>{(hashtag.engagement / 1000).toFixed(1)}K engagement</span>
                              <span className="font-semibold text-green-600">
                                {hashtag.engagementRate}% rate
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Heart, label: 'Likes', value: '45.2K', color: 'text-red-500' },
                        { icon: MessageSquare, label: 'Comments', value: '8.9K', color: 'text-blue-500' },
                        { icon: Share2, label: 'Shares', value: '12.4K', color: 'text-green-500' },
                        { icon: Eye, label: 'Views', value: '285K', color: 'text-purple-500' },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-4 border rounded-lg">
                          <item.icon className={cn('h-8 w-8 mx-auto mb-2', item.color)} />
                          <p className="text-2xl font-bold">{item.value}</p>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Insights */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">📈 Peak Engagement Time</p>
                  <p className="text-xs text-muted-foreground">
                    Your posts at 2 PM get 35% more engagement
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">✨ Top Content Type</p>
                  <p className="text-xs text-muted-foreground">
                    Video content performs 2.3x better than images
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">🎯 Best Platform</p>
                  <p className="text-xs text-muted-foreground">
                    Instagram drives the highest engagement rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Increase posting frequency on weekdays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Use more video content to boost engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Leverage trending hashtags #AI #Innovation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Post between 2-3 PM for maximum reach</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="h-4 w-4" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No alerts at this time. Keep up the great work!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

