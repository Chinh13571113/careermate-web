import SignInForm from "@/modules/client/auth/ui/components/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - CareerMate",
  description: "Sign In to your CareerMate account",
}

const SignInPage = () => {
  return (
    <SignInForm />
  );
}

export default SignInPage;