"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  isActive?: boolean;
  onClick?: () => void;
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
