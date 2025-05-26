import { LoginForm } from "./components";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center w-full px-6">
      <div className="w-full max-w-[450px]">
        <LoginForm />
      </div>
    </div>
  );
}
export const metadata = {
  title: 'Log In',
  description: 'Sign in to your CodeArena account',
};
