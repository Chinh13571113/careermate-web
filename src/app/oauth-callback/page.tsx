"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const accountType = searchParams.get("account_type");
    const profileCompleted = searchParams.get("profile_completed");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const rejectReason = searchParams.get("reject_reason");

    console.log("🔍 [OAuth Callback Page] Parameters:", {
      success,
      email,
      status,
      accountType,
      profileCompleted,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasRejectReason: !!rejectReason,
    });

    if (success === "true" && status === "registration_required" && accountType === "recruiter") {
      // Redirect to complete recruiter profile
      console.log("📝 [OAuth Callback] Redirecting to complete recruiter profile");
      toast("Please complete your recruiter profile");
      router.replace(`/auth/oauth/complete-recruiter?email=${encodeURIComponent(email || "")}`);
    } else if (success === "false" && status === "rejected") {
      // Account has been rejected by admin
      console.log("❌ [OAuth Callback] Account rejected by admin");
      toast.error("Your account has been rejected");
      const errorUrl = `/auth/oauth/error?status=rejected&email=${encodeURIComponent(email || "")}${rejectReason ? `&reason=${encodeURIComponent(rejectReason)}` : ""}`;
      router.replace(errorUrl);
    } else if (success === "true" && status === "pending") {
      // Account is pending approval - show pending page
      console.log("⏳ [OAuth Callback] Account pending approval");
      toast("Your account is awaiting approval");
      router.replace(`/auth/pending-approval?email=${encodeURIComponent(email || "")}`);
    } else if (success === "true" && (status === "ok" || status === "active") && accessToken) {
      // Successful login with active status - redirect to success page to set auth
      console.log("✅ [OAuth Callback] Login successful, redirecting to success page");
      toast.success("Login successful!");
      const successUrl = `/auth/oauth/success?token=${encodeURIComponent(accessToken)}&email=${encodeURIComponent(email || "")}${refreshToken ? `&refreshToken=${encodeURIComponent(refreshToken)}` : ""}`;
      router.replace(successUrl);
    } else {
      // Unknown or error state
      console.error("❌ [OAuth Callback] Error state:", { success, status, hasAccessToken: !!accessToken });
      toast.error("OAuth callback error. Please try again.");
      router.replace("/auth/oauth/error?message=OAuth%20callback%20error");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing OAuth callback...</p>
      </div>
    </div>
  );
}
