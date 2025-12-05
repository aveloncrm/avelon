'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Trash2, Mail, Crown } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'

interface TeamMember {
    id: string
    role: 'owner' | 'admin' | 'member'
    status?: 'pending' | 'accepted'
    merchant: {
        id: string
        email: string
        name: string | null
        avatar: string | null
    }
    inviter?: {
        email: string
        name: string | null
    }
    createdAt: string
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [inviting, setInviting] = useState(false)
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<'admin' | 'member' | 'owner'>('admin')

    useEffect(() => {
        loadTeamMembers()
    }, [])

    async function loadTeamMembers() {
        try {
            const data = await api.get('/api/team')
            setMembers(data)
        } catch (error: any) {
            console.error('Failed to load team members:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault()

        if (!email) return

        setInviting(true)
        try {
            await api.post('/api/team/invite', { email, role })
            toast.success(role === 'owner' ? 'Ownership transfer request sent!' : 'Team member invited successfully!')
            setEmail('')
            setRole('admin')
            loadTeamMembers()
        } catch (error: any) {
            toast.error(error.message || 'Failed to send invite')
        } finally {
            setInviting(false)
        }
    }

    async function handleRemove(id: string) {
        if (!confirm('Are you sure you want to remove this team member?')) return

        try {
            await api.delete(`/api/team?id=${id}`)
            toast.success('Team member removed')
            loadTeamMembers()
        } catch (error: any) {
            toast.error(error?.message || 'Failed to remove team member')
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Team"
                    description="Manage team members and their access"
                />
            </div>
            <Separator />

            <div className="grid gap-6">
                {/* Invite Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            <CardTitle>Invite Team Member</CardTitle>
                        </div>
                        <CardDescription>
                            Invite someone by their email address. They must have an account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-40">
                                    <Label htmlFor="role">Role</Label>
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as 'admin' | 'member' | 'owner')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="member">Member</option>
                                        <option value="owner">Owner</option>
                                    </select>
                                </div>
                            </div>
                            {role === 'owner' && (
                                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                                    ⚠️ <strong>Ownership Transfer:</strong> This will transfer full ownership. User must confirm via email.
                                </div>
                            )}
                            <Button type="submit" disabled={inviting} className="w-full">
                                {inviting ? 'Sending...' : role === 'owner' ? 'Send Ownership Transfer' : 'Send Invite'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Team Members List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                            {members.length} member{members.length !== 1 ? 's' : ''} in this store
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Loading...
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No team members yet. Invite someone to get started!
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Invited By</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {member.merchant.name || member.merchant.email.split('@')[0]}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {member.merchant.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                                                    {member.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                                                    {member.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={member.status === 'accepted' ? 'default' : 'outline'}>
                                                    {member.status === 'pending' ? 'Pending' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {member.inviter?.name || member.inviter?.email || '—'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(member.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {member.role !== 'owner' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemove(member.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
