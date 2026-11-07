"use client";

import { DashboardSidebar } from './components/web3/sidebar';
import './dashboard.css';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { CSSProperties } from 'react';

export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <SidebarProvider
      className="web3-dashboard bg-background text-foreground min-h-screen font-sans"
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '3.5rem',
        } as CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset className="p-4 lg:p-6 bg-background">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
