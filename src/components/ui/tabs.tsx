"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  isActive,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer",
        isActive ? " bg-blue-50 text-blue-600" : " hover:bg-gray-200",
        className
      )}
    >
      {children}
    </button>
  );
};

// Tab Content
interface TabContentProps {
  value?: string;
  children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({ value, children }) => {
  const { activeTab } = useTab();
  return <>{activeTab === value && <div>{children}</div>}</>;
};

// Tab Context
interface TabContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error("useTab must be used within TabProvider");
  return context;
};
