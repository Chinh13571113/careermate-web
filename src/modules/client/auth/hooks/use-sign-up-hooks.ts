import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must include at least one uppercase letter",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must include at least one lowercase letter",
  })
  .refine((value) => /[^A-Za-z0-9]/.test(value), {
    message: "Password must include at least one special character",
  });

export const signUpFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Email must end with @gmail.com",
    }),
  password: passwordSchema,
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Conditions",
  }),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const useSignUpHook = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
      };

      const response = await api.post("/api/users", payload);

      if (response.status >= 200 && response.status < 300) {
        toast.success("Account created successfully!");
        form.reset({
          username: "",
          email: "",
          password: "",
          terms: false,
        });
        setShowPassword(false);
        router.push("/sign-in");
        return;
      }

      toast.error("Failed to create account. Please try again.");
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Failed to create account. Please try again.";
      toast.error(message);
    }
  };
  useEffect(() => {
    const firstError = Object.keys(form.formState.errors)[0];
    if (firstError) {
      const field = document.querySelector(
        `[name="${firstError}"]`
      ) as HTMLElement;
      field?.focus();
    }
  }, [form.formState.errors]);

  return {
    form,
    onSubmit,
    showPassword,
    togglePasswordVisibility,
  };
};

export default useSignUpHook;
