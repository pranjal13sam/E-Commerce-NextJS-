import AppSidebar from "@/components/Application/Admin/AppSidebar";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="md:w-[calc(100vw-16rem)] ">
        <div className="pt-17.5 px-8 min-h-[calc(100vh-40px)] pb-10">
          <Topbar/>
        {children}

        </div>

        <div className="border-t h-10 flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
         © {new Date().getFullYear()} Pranjal. All Rights Reserved.

        </div>
        
        
        </main>
    </SidebarProvider>
  );
};

export default layout;
