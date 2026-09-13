"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { bodyWeightSchema } from "@/lib/validation";

export interface ProfileFormState {
  error?: string;
  success?: string;
}

export async function updateBodyWeightAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = bodyWeightSchema.safeParse({ bodyWeightKg: formData.get("bodyWeightKg") });
  if (!parsed.success) return { error: "Enter a weight between 20 and 400 kg" };

  await prisma.user.update({ where: { id: user.id }, data: { bodyWeightKg: parsed.data.bodyWeightKg } });
  revalidatePath("/profile");
  return { success: "Body weight updated" };
}
