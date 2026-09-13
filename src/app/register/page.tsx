import { RegisterForm } from "@/components/AuthForms";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">RepRank</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track lifts, climb tiers, share recipes with friends.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
