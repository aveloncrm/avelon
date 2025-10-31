'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Plus, Mail, Search, MoreVertical, Trash2, Edit, Shield, User, Crown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface TeamMember {
    id: string
    name: string
    email: string
    role: 'owner' | 'admin' | 'member' | 'viewer'
    status: 'active' | 'invited' | 'suspended'
    avatar?: string
    joinedAt: string
}

const mockTeamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        status: 'active',
        joinedAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: '2024-02-20',
    },
    {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'member',
        status: 'active',
        joinedAt: '2024-03-10',
    },
    {
        id: '4',
        name: 'Alice Williams',
        email: 'alice@example.com',
        role: 'member',
        status: 'invited',
        joinedAt: '2024-03-15',
    },
]

const roleIcons = {
    owner: Crown,
    admin: Shield,
    member: User,
    viewer: User,
}

const roleColors = {
    owner: 'bg-purple-500',
    admin: 'bg-blue-500',
    member: 'bg-green-500',
    viewer: 'bg-gray-500',
}

export default function TeamSettingsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [teamMembers] = useState<TeamMember[]>(mockTeamMembers)
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

    const filteredMembers = teamMembers.filter(
        (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Team Management"
                        description="Manage your team members and their roles"
                    />
                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to add a new member to your team
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="inviteEmail">Email Address</Label>
                                    <Input id="inviteEmail" type="email" placeholder="colleague@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="inviteRole">Role</Label>
                                    <Select defaultValue="member">
                                        <SelectTrigger id="inviteRole">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setIsInviteDialogOpen(false)}>Send Invitation</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <Separator />

                {/* Role Permissions Overview */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Owner</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">Full access</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Admin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">Most permissions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">Standard access</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamMembers.length}</div>
                            <p className="text-xs text-muted-foreground">Team members</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Members List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>
                                    Manage your team and their access levels
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredMembers.map((member) => {
                                const Icon = roleIcons[member.role]
                                return (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{member.name}</p>
                                                    <Icon className={`h-4 w-4 ${member.role === 'owner' ? 'text-purple-500' : 'text-gray-400'}`} />
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="secondary"
                                                className={`${member.status === 'active' ? 'bg-green-100 text-green-800' : ''} ${member.status === 'invited' ? 'bg-yellow-100 text-yellow-800' : ''
                                                    }`}
                                            >
                                                {member.status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={`${roleColors[member.role]} text-white`}
                                            >
                                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                            </Badge>
                                            {member.role !== 'owner' && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove Member
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Role Descriptions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>
                            Understand the permissions for each role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4 text-purple-500" />
                                    <h4 className="font-semibold">Owner</h4>
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• All admin permissions</li>
                                    <li>• Manage billing</li>
                                    <li>• Delete organization</li>
                                    <li>• Transfer ownership</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-blue-500" />
                                    <h4 className="font-semibold">Admin</h4>
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• All member permissions</li>
                                    <li>• Manage team members</li>
                                    <li>• Configure integrations</li>
                                    <li>• Access all settings</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-green-500" />
                                    <h4 className="font-semibold">Member</h4>
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Create and edit content</li>
                                    <li>• View team data</li>
                                    <li>• Basic integrations</li>
                                    <li>• Limited settings access</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <h4 className="font-semibold">Viewer</h4>
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Read-only access</li>
                                    <li>• View reports</li>
                                    <li>• Export data</li>
                                    <li>• No modifications</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
