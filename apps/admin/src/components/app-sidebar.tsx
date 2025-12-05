"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { StoreSwitcher } from "@/components/store-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import api from "@/lib/api"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Ecommerce",
      url: "/",
      icon: Settings2,
      items: [
        { title: "Banners", url: "/banners" },
        { title: "Brands", url: "/brands" },
        { title: "Categories", url: "/categories" },
        { title: "Orders", url: "/orders" },
        { title: "Payments", url: "/payments" },
        { title: "Products", url: "/products" },
        { title: "Discounts & Coupons", url: "/discounts" },
        { title: "Users", url: "/users" },
      ],
    },
    {
      title: "Sales CRM",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Dashboard", url: "/crm" },
        { title: "Contacts", url: "/crm/contacts" },
        { title: "Leads", url: "/crm/leads" },
        { title: "Pipeline", url: "/crm/pipeline" },
        { title: "Outreach", url: "/crm/outreach" },
        { title: "Sequences", url: "/crm/outreach/sequences" },
        { title: "Engagement", url: "/crm/outreach/engagement" },
        { title: "Lead Generation", url: "/crm/leads/generation" },
        { title: "Nurture Campaigns", url: "/crm/leads/nurture" },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "AI Post Creation", url: "/marketing/post-creation" },
        { title: "Social Scheduler", url: "/marketing/social-scheduler" },
        { title: "Content Library", url: "/marketing/content-library" },
        { title: "Campaigns", url: "/marketing/campaigns" },
        { title: "Paid Ads", url: "/marketing/paid-ads" },
        { title: "Analytics", url: "/marketing/analytics" }
      ],
    },
    {
      title: "AI Agents",
      url: "#",
      icon: Bot,
      items: [
        { title: "Calling Agent", url: "/crm/agents/calling" },
        { title: "Email Agent", url: "/crm/agents/email" },
        { title: "SMS Agent", url: "/crm/agents/sms" },
        { title: "Agent Studio", url: "/crm/agents/studio" },
        { title: "AI Insights", url: "/crm/agents/insights" }
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: PieChart,
      items: [
        { title: "Overview", url: "/crm/analytics" },
        { title: "Sales Reports", url: "/crm/reports/sales" },
        { title: "Marketing Reports", url: "/crm/reports/marketing" }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Stores",
          url: "/stores",
        },
        {
          title: "Billing",
          url: "/billing",
        },
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Limits",
          url: "/settings/limits",
        },
        { title: "Integrations", url: "/settings/integrations" },
        { title: "Notifications", url: "/settings/notifications" }
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  })

  React.useEffect(() => {
    loadMerchantInfo()
  }, [])

  async function loadMerchantInfo() {
    try {
      const merchant = await api.get('/api/auth/me')
      setUser({
        name: merchant.name || merchant.email?.split('@')[0] || 'Merchant',
        email: merchant.email || '',
        avatar: merchant.avatar || '/avatars/shadcn.jpg',
      })
    } catch (error) {
      console.error('Failed to load merchant info:', error)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <StoreSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
