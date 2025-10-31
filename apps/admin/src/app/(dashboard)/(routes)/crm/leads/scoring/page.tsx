'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Award, Settings } from 'lucide-react'
import { mockLeads } from '@/lib/mock-data/crm-leads'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

export default function LeadScoringPage() {
  const sortedLeads = [...mockLeads].sort((a, b) => b.score - a.score)
  const averageScore = Math.round(mockLeads.reduce((sum, l) => sum + l.score, 0) / mockLeads.length)

  const [autoQualifyThreshold, setAutoQualifyThreshold] = useState(75)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Lead Scoring"
            description="Configure scoring rules and view lead rankings"
          />
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configure Rules
          </Button>
        </div>
        <Separator />

        <Tabs defaultValue="scores" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scores">Lead Scores</TabsTrigger>
            <TabsTrigger value="rules">Scoring Rules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-4">
            {/* Score Distribution */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averageScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all leads</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Hot Leads (80+)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {mockLeads.filter(l => l.score >= 80).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">High priority</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Warm Leads (60-79)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {mockLeads.filter(l => l.score >= 60 && l.score < 80).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Medium priority</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cold Leads (&lt;60)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {mockLeads.filter(l => l.score < 60).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lower priority</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Scored Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Top Scored Leads</CardTitle>
                <CardDescription>Leads ranked by their engagement and qualification score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedLeads.slice(0, 10).map((lead, index) => (
                    <div key={lead.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lead.name}</span>
                          {lead.score >= 80 && (
                            <Badge variant="destructive" className="text-xs">Hot</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {lead.company} • {lead.jobTitle}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{lead.score}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        <div className="w-24">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getScoreColor(lead.score)}`}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                        <Link href={`/crm/leads/${lead.id}`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Criteria</CardTitle>
                <CardDescription>
                  Configure how leads are scored based on their attributes and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demographics Scoring */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Demographics
                  </h3>
                  <div className="space-y-4 pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title Score</Label>
                        <div className="flex items-center gap-4">
                          <Input type="number" placeholder="Points" defaultValue="15" className="w-24" />
                          <span className="text-sm text-muted-foreground">
                            C-Level, VP, Director
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Company Size</Label>
                        <div className="flex items-center gap-4">
                          <Input type="number" placeholder="Points" defaultValue="10" className="w-24" />
                          <span className="text-sm text-muted-foreground">
                            Enterprise (500+ employees)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Behavior Scoring */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Engagement & Behavior
                  </h3>
                  <div className="space-y-4 pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email Opened</Label>
                        <Input type="number" placeholder="Points" defaultValue="5" className="w-24" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Clicked</Label>
                        <Input type="number" placeholder="Points" defaultValue="10" className="w-24" />
                      </div>
                      <div className="space-y-2">
                        <Label>Website Visit</Label>
                        <Input type="number" placeholder="Points" defaultValue="8" className="w-24" />
                      </div>
                      <div className="space-y-2">
                        <Label>Demo Requested</Label>
                        <Input type="number" placeholder="Points" defaultValue="25" className="w-24" />
                      </div>
                      <div className="space-y-2">
                        <Label>Form Submitted</Label>
                        <Input type="number" placeholder="Points" defaultValue="15" className="w-24" />
                      </div>
                      <div className="space-y-2">
                        <Label>Case Study Download</Label>
                        <Input type="number" placeholder="Points" defaultValue="12" className="w-24" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Auto-Qualification */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Auto-Qualification Settings</h3>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Auto-Qualification</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically mark leads as qualified when they reach threshold
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Qualification Threshold</Label>
                        <span className="text-sm font-medium">{autoQualifyThreshold} points</span>
                      </div>
                      <Slider
                        value={[autoQualifyThreshold]}
                        onValueChange={(value) => setAutoQualifyThreshold(value[0])}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leads scoring {autoQualifyThreshold}+ will be auto-qualified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Rules</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { range: '90-100', count: mockLeads.filter(l => l.score >= 90).length, color: 'bg-red-500' },
                      { range: '80-89', count: mockLeads.filter(l => l.score >= 80 && l.score < 90).length, color: 'bg-orange-500' },
                      { range: '70-79', count: mockLeads.filter(l => l.score >= 70 && l.score < 80).length, color: 'bg-yellow-500' },
                      { range: '60-69', count: mockLeads.filter(l => l.score >= 60 && l.score < 70).length, color: 'bg-green-500' },
                      { range: '50-59', count: mockLeads.filter(l => l.score >= 50 && l.score < 60).length, color: 'bg-blue-500' },
                      { range: 'Below 50', count: mockLeads.filter(l => l.score < 50).length, color: 'bg-gray-500' },
                    ].map((item) => (
                      <div key={item.range} className="flex items-center gap-3">
                        <div className="w-20 text-sm font-medium">{item.range}</div>
                        <div className="flex-1">
                          <div className="h-6 bg-muted rounded-md overflow-hidden">
                            <div
                              className={`h-full ${item.color} flex items-center px-3 text-white text-sm`}
                              style={{ width: `${(item.count / mockLeads.length) * 100}%` }}
                            >
                              {item.count > 0 && item.count}
                            </div>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-right">
                          {((item.count / mockLeads.length) * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Impact on Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: 'Hot Leads (80+)', converted: 4, total: mockLeads.filter(l => l.score >= 80).length },
                      { range: 'Warm Leads (60-79)', converted: 2, total: mockLeads.filter(l => l.score >= 60 && l.score < 80).length },
                      { range: 'Cold Leads (<60)', converted: 1, total: mockLeads.filter(l => l.score < 60).length },
                    ].map((item) => {
                      const conversionRate = item.total > 0 ? (item.converted / item.total * 100).toFixed(1) : 0
                      return (
                        <div key={item.range} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.range}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.converted}/{item.total} converted
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${conversionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-12 text-right">{conversionRate}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-gradient-to-r from-red-500 to-orange-500'
  if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-green-500'
  return 'bg-gradient-to-r from-blue-500 to-gray-500'
}

