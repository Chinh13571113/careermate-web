import SignUpForm from "@/modules/client/auth/ui/components/sign-up-form"
import AuthGuard from "@/components/auth/auth-guard";

export const metadata = {
  title: "Sign Up - CareerMate",
  description: "Create a new CareerMate account",
}

const SignUpPage = () => {
  return (
    
      <SignUpForm />
    
  );
}

export default SignUpPage;