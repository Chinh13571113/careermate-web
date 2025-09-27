"use client";

import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge("p-4 border rounded-lg shadow-sm bg-white", className)}
      {...props}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
