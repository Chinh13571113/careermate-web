/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/use-auth-store";

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

  const onSubmit = async (data: FormValues) => {
     try {
      await login(data.email, data.password);
      toast.success("Login successful!");
      route.replace("/");
    } catch (err:any) {
      toast.error(err);
      console.error("Login error", err);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return { onSubmit, form, showPassword, togglePasswordVisibility };
};

export default useSignInHook;
