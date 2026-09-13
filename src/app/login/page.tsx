import { LoginForm } from "@/components/AuthForms";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">RepRank</h1>
          <p className="mt-1 text-sm text-zinc-400">Welcome back. Log in to keep your streak.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
