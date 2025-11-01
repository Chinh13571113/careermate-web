import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/use-auth-store";
import { decodeJWT, ADMIN_ROLES } from "@/lib/auth-admin";
import { safeLog, DEBUG } from "@/lib/debug-config";
import { getDefaultRedirectPath, isRecruiter } from "@/lib/role-utils";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(2, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof formSchema>;

const useSignInHook = () => {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkIsAdmin = (token: string): boolean => {
    try {
      const decoded = decodeJWT(token);
      const roles = decoded?.scope ? [decoded.scope] : decoded?.roles || [];
      return ADMIN_ROLES.some((role) => roles.includes(role));
    } catch (error) {
      safeLog.error("Error checking admin role:", error);
      return false;
    }
  };

  const onSubmit = async (data: FormValues) => {
    // ⚠️ SECURITY: Never log email in production
    if (DEBUG.LOGIN) {
      safeLog.authState("🔵 [SIGNIN] Starting login", {
        hasEmail: !!data.email,
      });
    }

    try {
      const result = await login(data.email, data.password);

      if (DEBUG.LOGIN) {
        safeLog.authState("🔵 [SIGNIN] Login result received", {
          success: result.success,
          isAdmin: result.isAdmin,
        });
      }

      if (result.success) {
        toast.success("Login successful!");
        form.reset(); // Clear form after successful login

        // Wait a bit to ensure the store is updated
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Get the updated auth state from the store after login
        const { accessToken, user, role, isAuthenticated } =
          useAuthStore.getState();

        if (DEBUG.LOGIN) {
          safeLog.authState("🔵 [SIGNIN] Updated store state", {
            hasToken: !!accessToken,
            isAuth: isAuthenticated,
            hasUser: !!user,
            role,
            tokenLength: accessToken?.length || 0,
          });
        }

        if (accessToken) {
          // ⚠️ SECURITY: Never log token or decoded payload
          // OLD: console.log("🔵 [SIGNIN] Token payload:", tokenPayload);

          // Check admin status with the new token
          const isAdmin = checkIsAdmin(accessToken);

          if (DEBUG.LOGIN) {
            safeLog.authState("🔵 [SIGNIN] Admin check", {
              isAdmin,
              roleFromStore: role,
            });
          }

          // Determine redirect path based on role
          const redirectPath = getDefaultRedirectPath(role);

          // Use multiple redirect methods for reliability
          // Wait longer to ensure state is fully updated
          setTimeout(() => {
            if (DEBUG.LOGIN) {
              safeLog.authState("🟢 [SIGNIN] Redirecting after login", {
                role,
                redirectPath,
              });
            }

            // Use window.location for more reliable navigation
            window.location.href = redirectPath;
          }, 500); // Increased delay to ensure state sync
        } else {
          const error = new Error("No access token found after login");
          safeLog.error("🔴 [SIGNIN] No access token found after login", error);
          toast.error("Login failed - no token received");
          route.push("/");
        }
      } else {
        if (DEBUG.LOGIN) {
          safeLog.authState("🔴 [SIGNIN] Login failed", {});
        }
        toast.error("Invalid credentials");
      }
    } catch (err: any) {
      safeLog.error("🔴 [SIGNIN] Login error:", err);
      
      // Check if account is rejected
      if (err?.isRejected) {
        const email = err?.email || data.email;
        const reason = err?.reason || "No reason provided";
        console.log("❌ [SIGNIN] Account rejected by admin");
        toast.error("Your account has been rejected");
        
        // Redirect to error page with rejected status
        setTimeout(() => {
          route.push(`/auth/oauth/error?status=rejected&email=${encodeURIComponent(email)}&reason=${encodeURIComponent(reason)}`);
        }, 500);
        return;
      }
      
      // Check if account is pending approval
      if (err?.isPending) {
        const email = err?.email || data.email;
        console.log("⏳ [SIGNIN] Account pending approval, redirecting to pending page");
        toast("Your account is awaiting approval");
        
        // Redirect to pending approval page
        setTimeout(() => {
          route.push(`/auth/pending-approval?email=${encodeURIComponent(email)}`);
        }, 500);
        return;
      }
      
      // Extract the actual error message for the toast
      const errorMessage =
        err?.message || err?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  const clearForm = () => {
    form.reset({ email: "", password: "" });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return { onSubmit, form, showPassword, togglePasswordVisibility, clearForm };
};

export default useSignInHook;
