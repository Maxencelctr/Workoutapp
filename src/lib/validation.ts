import { z } from "zod";
import { DIFFICULTIES, EQUIPMENT, MUSCLE_GROUPS, VISIBILITIES } from "./constants";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(24, "Username must be at most 24 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed");

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const exerciseSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(60),
  primaryMuscle: z.enum(MUSCLE_GROUPS),
  secondaryMuscles: z.array(z.enum(MUSCLE_GROUPS)).max(4).default([]),
  equipment: z.enum(EQUIPMENT),
  difficulty: z.enum(DIFFICULTIES),
  instructions: z.string().trim().min(10, "Add a short how-to (10+ characters)").max(2000),
});

export const logSetSchema = z.object({
  exerciseId: z.string().min(1),
  weightKg: z.coerce.number().min(0).max(1000),
  reps: z.coerce.number().int().min(1).max(200),
  sessionId: z.string().optional(),
});

export const recipeSchema = z.object({
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(500),
  ingredients: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),
        quantity: z.string().trim().min(1).max(40),
      }),
    )
    .min(1, "Add at least one ingredient"),
  instructions: z.string().trim().min(10).max(4000),
  calories: z.coerce.number().int().min(0).max(10000),
  proteinG: z.coerce.number().int().min(0).max(1000),
  carbsG: z.coerce.number().int().min(0).max(1000),
  fatG: z.coerce.number().int().min(0).max(1000),
  servings: z.coerce.number().int().min(1).max(50),
  prepMinutes: z.coerce.number().int().min(0).max(600),
  tags: z.array(z.string()).max(6).default([]),
  visibility: z.enum(VISIBILITIES).default("PRIVATE"),
});

export const bodyWeightSchema = z.object({
  bodyWeightKg: z.coerce.number().min(20).max(400),
});
