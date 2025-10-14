"use client";

import { useEffect } from "react";
import {
  cleanupSensitiveData,
  auditLocalStorage,
} from "@/lib/security-cleanup";

/**
 * Component chạy một lần khi app load để xóa dữ liệu nhạy cảm
 * Đặt ở root layout để chạy cho tất cả routes
 */
export function SecurityCleanup() {
  useEffect(() => {
    // Audit trước
    const audit = auditLocalStorage();

    // Nếu có dữ liệu nhạy cảm, xóa ngay
    if (audit && audit.hasSensitiveData) {
      cleanupSensitiveData();
    }
  }, []);

  return null; // Component này không render gì
}
