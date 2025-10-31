'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAllEnrichedContacts, EnrichedContact } from '@/lib/mock-data/crm-unified'
import { Search, Mail, Phone, Building2, TrendingUp, Target, DollarSign, Users, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ContactsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<'all' | 'contact' | 'lead' | 'deal' | 'customer'>('all')
  
  const allContacts = getAllEnrichedContacts()
  
  const filteredContacts = allContacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStage = stageFilter === 'all' || contact.stage === stageFilter
    
    return matchesSearch && matchesStage
  })

  const stats = {
    total: allContacts.length,
    contacts: allContacts.filter(c => c.stage === 'contact').length,
    leads: allContacts.filter(c => c.stage === 'lead').length,
    deals: allContacts.filter(c => c.stage === 'deal').length,
    customers: allContacts.filter(c => c.stage === 'customer').length,
  }

  const getStageBadge = (stage: 'contact' | 'lead' | 'deal' | 'customer') => {
    const config = {
      contact: { label: 'Contact', variant: 'secondary' as const, className: '' },
      lead: { label: 'Lead', variant: 'default' as const, className: 'bg-blue-600' },
      deal: { label: 'Active Deal', variant: 'default' as const, className: 'bg-orange-600' },
      customer: { label: 'Customer', variant: 'default' as const, className: 'bg-green-600' },
    }
    return config[stage]
  }

  const handleContactClick = (contact: EnrichedContact) => {
    // Navigate based on their current stage
    if (contact.stage === 'lead' && contact.lead) {
      router.push(`/crm/leads/${contact.lead.id}`)
    } else if ((contact.stage === 'deal' || contact.stage === 'customer') && contact.deals.length > 0) {
      router.push(`/crm/pipeline/${contact.deals[0].id}`)
    } else {
      router.push(`/crm/contacts/${contact.id}`)
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Contacts (${allContacts.length})`}
            description="Master view of all contacts and their customer journey stage"
          />
          <Link href="/crm/leads/new">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </Link>
        </div>
        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className={`cursor-pointer transition-all ${stageFilter === 'all' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStageFilter('all')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${stageFilter === 'contact' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStageFilter('contact')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Contacts</p>
                <p className="text-3xl font-bold">{stats.contacts}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${stageFilter === 'lead' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStageFilter('lead')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-3xl font-bold text-blue-600">{stats.leads}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${stageFilter === 'deal' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStageFilter('deal')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-3xl font-bold text-orange-600">{stats.deals}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer transition-all ${stageFilter === 'customer' ? 'ring-2 ring-primary' : ''}`} onClick={() => setStageFilter('customer')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-3xl font-bold text-green-600">{stats.customers}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contacts List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => {
            const stageBadge = getStageBadge(contact.stage)
            
            return (
              <Card 
                key={contact.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleContactClick(contact)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                      </div>
                      <Badge variant={stageBadge.variant} className={stageBadge.className}>
                        {stageBadge.label}
                      </Badge>
                    </div>

                    {/* Company */}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{contact.company}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>

                    {/* Journey Info */}
                    <Separator />
                    <div className="space-y-2">
                      {contact.lead && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>Lead Score</span>
                          </div>
                          <span className="font-semibold">{contact.lead.score}/100</span>
                        </div>
                      )}
                      
                      {contact.deals.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-orange-600" />
                            <span>Active Deals</span>
                          </div>
                          <span className="font-semibold">{contact.deals.length}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>Total Value</span>
                        </div>
                        <span className="font-semibold">
                          ${(contact.totalValue / 1000).toFixed(0)}K
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Activities</span>
                        <span className="font-semibold">{contact.activities.length}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {contact.tags.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{contact.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}

                    {/* Action */}
                    <div className="flex justify-end pt-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredContacts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'Add your first contact to get started'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

