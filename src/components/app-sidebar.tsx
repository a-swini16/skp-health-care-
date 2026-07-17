"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Microscope,
  Package,
  Settings,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

// Sample navigation data
const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Patient Management",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Test Management",
    url: "/tests",
    icon: Microscope,
  },
  {
    title: "Doctor Management",
    url: "/doctors",
    icon: Users, // Or Stethoscope if available, using Users for now as generic, or Activity
  },
  {
    title: "Sample Tracking",
    url: "/sample-tracking",
    icon: Activity,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary">
          <img src="/logo.webp" alt="SKP Healthcare Logo" className="h-8 w-auto object-contain" />
          <span>SKP Healthcare</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 py-4 gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                render={
                  <Link href={item.url} className="flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary rounded-md w-full">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                } 
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <ThemeToggle />
        <div className="flex items-center gap-3 mt-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
            N
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@skp.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
