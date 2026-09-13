"use client";

import { useActionState, useRef, useEffect } from "react";
import { logSetAction, type LogSetFormState } from "@/actions/exercises";

const initialState: LogSetFormState = {};

export function LogSetForm({ exerciseId, isBodyweight }: { exerciseId: string; isBodyweight: boolean }) {
  const [state, formAction, pending] = useActionState(logSetAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="font-semibold text-white">Log a set</h3>
      <input type="hidden" name="exerciseId" value={exerciseId} />
      <div className="flex gap-3">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-zinc-400">Weight (kg)</span>
          <input
            name="weightKg"
            type="number"
            step="0.5"
            min="0"
            defaultValue={isBodyweight ? 0 : undefined}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-zinc-400">Reps</span>
          <input
            name="reps"
            type="number"
            step="1"
            min="1"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {pending ? "Logging..." : "Log set"}
      </button>
      {state.success && <p className="text-sm text-emerald-400">{state.success}</p>}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
