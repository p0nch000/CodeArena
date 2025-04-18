import { CodeChallenge } from "./components"; 

export default function Homepage() {
  return (
    <div className="flex min-h-screen items-center justify-center w-full px-6">
      <div className="w-full max-w-[450px]">
        <CodeChallenge />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Homepage',
  description: 'Start your journey with CodeArena',
};