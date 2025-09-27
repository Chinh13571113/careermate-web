"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { TabsList, TabsTrigger, useTab } from "./tabs";

type SidebarItem = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { activeTab, setActiveTab } = useTab();

  return (
    <TabsList className="flex flex-col p-1 rounded-md">
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          isActive={activeTab === item.value}
          onClick={() => setActiveTab(item.value)}
          className="justify-start p-2 text-left text-xs "
        >
          <div className="flex">
            <div className="flex mr-4">
              {item.icon && <item.icon className="w-4" />}
            </div>
            <div className="flex-1 font-normal mt-1">
              <span>{item.label}</span>
            </div>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default Sidebar;
