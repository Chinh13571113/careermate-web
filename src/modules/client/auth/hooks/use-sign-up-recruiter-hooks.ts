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

const phoneRegex = /^0\d{9}$/;

export const signUpRecruiterFormSchema = z.object({
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
  // Organization Information
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" }),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .url({ message: "Please enter a valid logo URL" })
    .optional()
    .or(z.literal("")),
  about: z
    .string()
    .optional()
    .or(z.literal("")),
  businessLicense: z
    .string()
    .min(5, { message: "Business license must be at least 5 characters" }),
  contactPerson: z
    .string()
    .min(2, { message: "Contact person name must be at least 2 characters" }),
  phoneNumber: z
    .string()
    .regex(phoneRegex, { message: "Phone number must be 10 digits starting with 0" }),
  companyAddress: z
    .string()
    .min(5, { message: "Company address must be at least 5 characters" }),
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Conditions",
  }),
});

export type SignUpRecruiterFormValues = z.infer<typeof signUpRecruiterFormSchema>;

const useSignUpRecruiterHook = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpRecruiterFormValues>({
    resolver: zodResolver(signUpRecruiterFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      companyName: "",
      website: "",
      logoUrl: "",
      businessLicense: "",
      contactPerson: "",
      phoneNumber: "",
      companyAddress: "",
      terms: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: SignUpRecruiterFormValues) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        organizationInfo: {
          companyName: values.companyName,
          website: values.website || undefined,
          logoUrl: values.logoUrl || undefined,
          about: values.about || "",
          businessLicense: values.businessLicense,
          contactPerson: values.contactPerson,
          phoneNumber: values.phoneNumber,
          companyAddress: values.companyAddress,
        },
      };

  const response = await api.post("/api/registration/recruiter", payload);

      if (response.status >= 200 && response.status < 300) {
        const result = response.data?.result;
        
        if (result && result.status === "PENDING") {
          toast.success(`Recruiter account created successfully! Status: ${result.status}`);
          
          // Store user info in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("pending_profile_email", result.email);
            localStorage.setItem("pending_profile_username", result.username);
          }
          
          form.reset({
            username: "",
            email: "",
            password: "",
            companyName: "",
            website: "",
            logoUrl: "",
            businessLicense: "",
            contactPerson: "",
            phoneNumber: "",
            companyAddress: "",
            terms: false,
          });
          setShowPassword(false);
          
          toast.success("Please sign in to continue");
          router.push("/sign-in");
          return;
        }
      }

      toast.error("Failed to create account. Please try again.");
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Failed to create recruiter account. Please try again.";
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

export default useSignUpRecruiterHook;
