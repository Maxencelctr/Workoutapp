"use client";

import { useActionState } from "react";
import { updateBodyWeightAction, type ProfileFormState } from "@/actions/profile";

const initialState: ProfileFormState = {};

export function BodyWeightForm({ current }: { current: number | null }) {
  const [state, formAction, pending] = useActionState(updateBodyWeightAction, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input
        name="bodyWeightKg"
        type="number"
        step="0.1"
        min="20"
        max="400"
        defaultValue={current ?? undefined}
        placeholder="kg"
        className="w-24 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
      {state.success && <span className="text-xs text-emerald-400">Saved</span>}
      {state.error && <span className="text-xs text-red-400">{state.error}</span>}
    </form>
  );
}
