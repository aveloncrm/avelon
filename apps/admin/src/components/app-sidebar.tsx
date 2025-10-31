"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Amri Sabiq",
    email: "sabiqsabi313@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Galamine AI",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
        { title: "Inventory", url: "/inventory" },
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
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        // {
        //   title: "Billing",
        //   url: "/settings/billing",
        // },
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 py-4 px-2">
          <span className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground w-8 h-8 font-bold text-lg shrink-0">
            {/* Axis of neuron icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="10" r="2.5" fill="currentColor" />
              <line x1="10" y1="10" x2="16" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="10" y1="10" x2="4" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-lg leading-none tracking-tight group-data-[collapsible=icon]:hidden">Avelon</span>
            <span className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Powered by Galamine</span>
          </div>
        </div>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
