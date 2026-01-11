import React from "react";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

const AppSidebar = () => {
  return (
    <Sidebar className="z-50">
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-4">
          <Image
            src={logoBlack.src}
            width={logoBlack.width}
            height={50}
            className="block dark:hidden h-12.5 w-auto"
            alt="logo dark"
          />
          <Image
            src={logoWhite.src}
            width={logoWhite.width}
            height={50}
            className="hidden dark:block h-12.5 w-auto"
            alt="logo white"
          />
          <Button type="button" size="icon" className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => {
            return (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      className="font-semibold px-2 py-5"
                    >
                      <Link href={menu?.url}>
                        <menu.icon />
                        {menu?.title}

                        {menu?.submenu && menu.submenu.length > 0 && (
                          <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {menu?.submenu && menu.submenu.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.submenu.map((subMenu, subMenuIndex) => (
                          <SidebarMenuItem key={subMenuIndex}>
                            <SidebarMenuSubButton asChild className="px-2 py-5">
                              <Link href={subMenu.url}>{subMenu.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
