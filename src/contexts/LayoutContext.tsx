"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LayoutContextType {
  headerHeight: number;
}

const LayoutContext = createContext<LayoutContextType>({ headerHeight: 0 });

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // Đảm bảo chỉ chạy ở client-side
    if (typeof window === "undefined") return;

    const el = document.querySelector("header");
    if (!el) return;

    const update = () => setHeaderHeight(el.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    // Lưu vào localStorage để tránh giật khi chuyển trang
    if (headerHeight > 0) {
      localStorage.setItem("headerHeight", headerHeight.toString());
    }

    return () => ro.disconnect();
  }, [headerHeight]);

  return (
    <LayoutContext.Provider value={{ headerHeight }}>
      {children}
    </LayoutContext.Provider>
  );
};
