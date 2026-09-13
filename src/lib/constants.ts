export const MUSCLE_GROUPS = [
  "CHEST",
  "BACK",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "FOREARMS",
  "CORE",
  "QUADRICEPS",
  "HAMSTRINGS",
  "GLUTES",
  "CALVES",
  "TRAPS",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  CHEST: "Chest",
  BACK: "Back",
  SHOULDERS: "Shoulders",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  FOREARMS: "Forearms",
  CORE: "Core",
  QUADRICEPS: "Quadriceps",
  HAMSTRINGS: "Hamstrings",
  GLUTES: "Glutes",
  CALVES: "Calves",
  TRAPS: "Traps",
};

export const EQUIPMENT = [
  "BARBELL",
  "DUMBBELL",
  "MACHINE",
  "CABLE",
  "BODYWEIGHT",
  "KETTLEBELL",
  "BAND",
] as const;

export type Equipment = (typeof EQUIPMENT)[number];

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  BARBELL: "Barbell",
  DUMBBELL: "Dumbbell",
  MACHINE: "Machine",
  CABLE: "Cable",
  BODYWEIGHT: "Bodyweight",
  KETTLEBELL: "Kettlebell",
  BAND: "Resistance band",
};

export const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const VISIBILITIES = ["PRIVATE", "FRIENDS", "PUBLIC"] as const;

export type Visibility = (typeof VISIBILITIES)[number];

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  PRIVATE: "Only me",
  FRIENDS: "Friends",
  PUBLIC: "Everyone",
};

export const RECIPE_TAGS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "high-protein",
  "post-workout",
  "vegetarian",
  "vegan",
  "quick",
  "meal-prep",
] as const;

export const FRIENDSHIP_STATUSES = ["PENDING", "ACCEPTED", "DECLINED"] as const;

export type FriendshipStatus = (typeof FRIENDSHIP_STATUSES)[number];
