"use client";

import { useActionState, useState } from "react";
import { createExerciseAction, type ExerciseFormState } from "@/actions/exercises";
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  EQUIPMENT,
  EQUIPMENT_LABELS,
  MUSCLE_GROUPS,
  MUSCLE_GROUP_LABELS,
} from "@/lib/constants";

const initialState: ExerciseFormState = {};

export function NewExerciseForm() {
  const [state, formAction, pending] = useActionState(createExerciseAction, initialState);
  const [primaryMuscle, setPrimaryMuscle] = useState(MUSCLE_GROUPS[0]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300" htmlFor="name">
          Exercise name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g. Landmine Press"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-red-400">{state.fieldErrors.name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300" htmlFor="primaryMuscle">
            Primary muscle
          </label>
          <select
            id="primaryMuscle"
            name="primaryMuscle"
            value={primaryMuscle}
            onChange={(e) => setPrimaryMuscle(e.target.value as typeof primaryMuscle)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          >
            {MUSCLE_GROUPS.map((m) => (
              <option key={m} value={m}>
                {MUSCLE_GROUP_LABELS[m]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-300" htmlFor="equipment">
            Equipment
          </label>
          <select
            id="equipment"
            name="equipment"
            defaultValue={EQUIPMENT[0]}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
          >
            {EQUIPMENT.map((eq) => (
              <option key={eq} value={eq}>
                {EQUIPMENT_LABELS[eq]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-zinc-300">Secondary muscles (optional)</span>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.filter((m) => m !== primaryMuscle).map((m) => (
            <label
              key={m}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 has-checked:border-emerald-500 has-checked:text-emerald-400"
            >
              <input type="checkbox" name="secondaryMuscles" value={m} className="accent-emerald-500" />
              {MUSCLE_GROUP_LABELS[m]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300" htmlFor="difficulty">
          Difficulty
        </label>
        <select
          id="difficulty"
          name="difficulty"
          defaultValue="BEGINNER"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500 sm:w-60"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300" htmlFor="instructions">
          How to perform it
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={4}
          placeholder="Short step-by-step cues..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
        {state.fieldErrors?.instructions && (
          <p className="mt-1 text-xs text-red-400">{state.fieldErrors.instructions}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create exercise"}
      </button>
    </form>
  );
}
