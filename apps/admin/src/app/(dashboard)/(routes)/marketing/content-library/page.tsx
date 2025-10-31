'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, Grid3x3, List, Search, Download, Trash2, 
  Eye, MoreVertical, Image as ImageIcon, Video, FileText, Layout, 
  Star, Clock, TrendingUp, Sparkles 
} from 'lucide-react'
import { mockContentAssets, getContentStats, MediaType } from '@/lib/mock-data/marketing-content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function ContentLibraryPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  
  const stats = getContentStats()
  
  const filteredAssets = mockContentAssets.filter(asset => {
    if (selectedType !== 'all' && asset.type !== selectedType) return false
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !asset.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case 'performance':
        return (b.performanceScore || 0) - (a.performanceScore || 0)
      case 'usage':
        return b.usageCount - a.usageCount
      default:
        return 0
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Content Library"
            description="Manage your media assets and templates"
          />
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Assets
          </Button>
        </div>
        <Separator />

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.images}</p>
                <p className="text-xs text-muted-foreground">Images</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.videos}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.avgPerformance}</p>
                <p className="text-xs text-muted-foreground">Avg Performance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
                <p className="text-xs text-muted-foreground">Times Used</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="usage">Usage Count</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedAssets.map((asset) => (
              <AssetGridCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {sortedAssets.map((asset) => (
                  <AssetListItem key={asset.id} asset={asset} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {sortedAssets.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">No assets found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or upload new content
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Assets
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Asset Grid Card Component
function AssetGridCard({ asset }: { asset: any }) {
  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      case 'template': return <Layout className="h-4 w-4" />
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          {getTypeIcon(asset.type)}
        </div>
        {asset.aiGenerated && (
          <Badge className="absolute top-2 left-2 bg-purple-100 text-purple-700">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
        )}
        {asset.performanceScore && (
          <Badge className={cn('absolute top-2 right-2', getPerformanceColor(asset.performanceScore))}>
            {asset.performanceScore}
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="icon" variant="secondary">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm line-clamp-1">{asset.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{asset.format}</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {asset.usageCount} uses
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Asset List Item Component
function AssetListItem({ asset }: { asset: any }) {
  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      case 'document': return <FileText className="h-5 w-5" />
      case 'template': return <Layout className="h-5 w-5" />
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-accent transition-colors">
      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
        {getTypeIcon(asset.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{asset.name}</h3>
          {asset.aiGenerated && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{asset.description}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{asset.format}</span>
          <span>{(asset.fileSize / 1024 / 1024).toFixed(2)} MB</span>
          <span>{format(new Date(asset.uploadedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-center">
          <p className="text-sm font-semibold">{asset.usageCount}</p>
          <p className="text-xs text-muted-foreground">Uses</p>
        </div>
        {asset.performanceScore && (
          <div className="text-center">
            <p className="text-sm font-semibold text-green-600">{asset.performanceScore}</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="mr-2 h-4 w-4" />
              Usage History
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

