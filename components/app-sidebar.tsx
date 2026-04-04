"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BriefcaseMedical, PawPrint, LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon, Syringe, Calendar, Pill, Stethoscope, LogOutIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "User Management",
      url: "#",
      icon: <UsersIcon />,
      isActive: true,
      items: [
        {
          title: "Staffs",
          url: "/admin/staff",
        },
        {
          title: "Owners",
          url: "/admin/owner",
        },
      ],
    },
    {
      title: "Pet",
      url: "/admin/pet",
      icon: <PawPrint />,
    },
    {
      title: "Consultation",
      url: "/admin/consultation",
      icon: <BriefcaseMedical />,
    },
    {
      title: "Vaccination",
      url: "/admin/vaccination",
      icon: <Syringe />,
    },
    {
      title: "Appointments",
      url: "/admin/appointment",
      icon: <Calendar />,
    },
    {
      title: "Medication",
      url: "/admin/medication",
      icon: <Pill />,
    },
    {
      title: "Medical Records",
      url: "/admin/medical-records",
      icon: <Stethoscope />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <CameraIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      name: "Reports",
      url: "#",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: (
        <FileIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Successfully logged out")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Logout failed")
      }
    } catch (error) {
      toast.error("An error occurred during logout")
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Pet Veterinary</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
