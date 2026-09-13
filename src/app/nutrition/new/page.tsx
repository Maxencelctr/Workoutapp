import { NewRecipeForm } from "@/components/NewRecipeForm";

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-white">Add a recipe</h1>
      <p className="mb-6 text-sm text-zinc-400">Share what fuels your training.</p>
      <NewRecipeForm />
    </div>
  );
}
