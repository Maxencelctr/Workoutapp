"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { exerciseSchema, logSetSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { logSetForUser } from "@/lib/workout";
import type { MuscleGroup } from "@/lib/constants";

export interface ExerciseFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createExerciseAction(_prev: ExerciseFormState, formData: FormData): Promise<ExerciseFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = exerciseSchema.safeParse({
    name: formData.get("name"),
    primaryMuscle: formData.get("primaryMuscle"),
    secondaryMuscles: formData.getAll("secondaryMuscles"),
    equipment: formData.get("equipment"),
    difficulty: formData.get("difficulty"),
    instructions: formData.get("instructions"),
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
  const secondaryMuscles = data.secondaryMuscles.filter((m: MuscleGroup) => m !== data.primaryMuscle);

  const base = slugify(data.name) || "exercise";
  let slug = base;
  let suffix = 1;
  while (await prisma.exercise.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix++}`;
  }

  const exercise = await prisma.exercise.create({
    data: {
      name: data.name,
      slug,
      primaryMuscle: data.primaryMuscle,
      secondaryMuscles: JSON.stringify(secondaryMuscles),
      equipment: data.equipment,
      difficulty: data.difficulty,
      instructions: data.instructions,
      isCustom: true,
      createdById: user.id,
    },
  });

  revalidatePath("/exercises");
  redirect(`/exercises/${exercise.slug}`);
}

export interface LogSetFormState {
  error?: string;
  success?: string;
}

export async function logSetAction(_prev: LogSetFormState, formData: FormData): Promise<LogSetFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = logSetSchema.safeParse({
    exerciseId: formData.get("exerciseId"),
    weightKg: formData.get("weightKg"),
    reps: formData.get("reps"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid weight and rep count" };
  }

  const exercise = await prisma.exercise.findUnique({ where: { id: parsed.data.exerciseId } });
  if (!exercise) return { error: "Exercise not found" };

  const result = await logSetForUser({
    userId: user.id,
    exerciseId: exercise.id,
    weightKg: parsed.data.weightKg,
    reps: parsed.data.reps,
  });

  revalidatePath(`/exercises/${exercise.slug}`);
  revalidatePath("/exercises");
  revalidatePath("/");
  revalidatePath("/profile");

  return {
    success: result.isPr
      ? `New personal record! +${result.lpGained} LP`
      : `Set logged. +${result.lpGained} LP`,
  };
}
