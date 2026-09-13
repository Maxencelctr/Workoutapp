"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recipeSchema } from "@/lib/validation";

export interface RecipeFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createRecipeAction(_prev: RecipeFormState, formData: FormData): Promise<RecipeFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const ingredientNames = formData.getAll("ingredientName").map(String);
  const ingredientQuantities = formData.getAll("ingredientQuantity").map(String);
  const ingredients = ingredientNames
    .map((name, i) => ({ name: name.trim(), quantity: (ingredientQuantities[i] ?? "").trim() }))
    .filter((i) => i.name.length > 0);

  const parsed = recipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    ingredients,
    instructions: formData.get("instructions"),
    calories: formData.get("calories"),
    proteinG: formData.get("proteinG"),
    carbsG: formData.get("carbsG"),
    fatG: formData.get("fatG"),
    servings: formData.get("servings"),
    prepMinutes: formData.get("prepMinutes"),
    tags: formData.getAll("tags"),
    visibility: formData.get("visibility") || "PRIVATE",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const recipe = await prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      ingredients: JSON.stringify(data.ingredients),
      instructions: data.instructions,
      calories: data.calories,
      proteinG: data.proteinG,
      carbsG: data.carbsG,
      fatG: data.fatG,
      servings: data.servings,
      prepMinutes: data.prepMinutes,
      tags: JSON.stringify(data.tags),
      visibility: data.visibility,
      authorId: user.id,
    },
  });

  revalidatePath("/nutrition");
  redirect(`/nutrition/${recipe.id}`);
}
