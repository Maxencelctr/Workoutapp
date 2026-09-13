"use client";

import { useActionState, useState } from "react";
import { createRecipeAction, type RecipeFormState } from "@/actions/recipes";
import { RECIPE_TAGS, VISIBILITIES, VISIBILITY_LABELS } from "@/lib/constants";

const initialState: RecipeFormState = {};

export function NewRecipeForm() {
  const [state, formAction, pending] = useActionState(createRecipeAction, initialState);
  const [ingredients, setIngredients] = useState([{ id: 0, name: "", quantity: "" }]);
  const [nextId, setNextId] = useState(1);

  function addIngredient() {
    setIngredients((prev) => [...prev, { id: nextId, name: "", quantity: "" }]);
    setNextId((n) => n + 1);
  }

  function removeIngredient(id: number) {
    setIngredients((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Title" name="title" error={state.fieldErrors?.title}>
        <input
          name="title"
          required
          placeholder="e.g. High-Protein Overnight Oats"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
      </Field>

      <Field label="Short description" name="description" error={state.fieldErrors?.description}>
        <input
          name="description"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
      </Field>

      <div>
        <span className="mb-1 block text-sm font-medium text-zinc-300">Ingredients</span>
        <div className="space-y-2">
          {ingredients.map((row) => (
            <div key={row.id} className="flex gap-2">
              <input
                name="ingredientName"
                placeholder="Ingredient"
                className="flex-[2] rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
              <input
                name="ingredientQuantity"
                placeholder="Qty (e.g. 100 g)"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => removeIngredient(row.id)}
                className="rounded-lg border border-zinc-700 px-2.5 text-zinc-400 hover:border-red-500 hover:text-red-400"
                aria-label="Remove ingredient"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 text-sm font-medium text-emerald-400 hover:underline"
        >
          + Add ingredient
        </button>
        {state.fieldErrors?.ingredients && (
          <p className="mt-1 text-xs text-red-400">{state.fieldErrors.ingredients}</p>
        )}
      </div>

      <Field label="Instructions" name="instructions" error={state.fieldErrors?.instructions}>
        <textarea
          name="instructions"
          required
          rows={4}
          placeholder="Step-by-step..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField label="Calories" name="calories" />
        <NumberField label="Protein (g)" name="proteinG" />
        <NumberField label="Carbs (g)" name="carbsG" />
        <NumberField label="Fat (g)" name="fatG" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Servings" name="servings" defaultValue={1} min={1} />
        <NumberField label="Prep time (min)" name="prepMinutes" defaultValue={10} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-zinc-300">Tags</span>
        <div className="flex flex-wrap gap-2">
          {RECIPE_TAGS.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 has-checked:border-emerald-500 has-checked:text-emerald-400"
            >
              <input type="checkbox" name="tags" value={tag} className="accent-emerald-500" />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300" htmlFor="visibility">
          Who can see this recipe?
        </label>
        <select
          id="visibility"
          name="visibility"
          defaultValue="PRIVATE"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-emerald-500 sm:w-60"
        >
          {VISIBILITIES.map((v) => (
            <option key={v} value={v}>
              {VISIBILITY_LABELS[v]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save recipe"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function NumberField({
  label,
  name,
  defaultValue = 0,
  min = 0,
}: {
  label: string;
  name: string;
  defaultValue?: number;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-400">{label}</span>
      <input
        name={name}
        type="number"
        min={min}
        defaultValue={defaultValue}
        required
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
      />
    </label>
  );
}
