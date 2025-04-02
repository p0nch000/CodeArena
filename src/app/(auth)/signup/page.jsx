import { SignUpForm } from "./components";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center w-full px-6">
      <div className="w-full max-w-[450px]">
        <SignUpForm />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new CodeArena account',
};