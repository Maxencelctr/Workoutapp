import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";
import { logSetForUser } from "../src/lib/workout";
import { EXERCISES } from "./exercise-data";
import { RECIPES } from "./recipe-data";

async function seedExercises() {
  console.log(`Seeding ${EXERCISES.length} exercises...`);
  for (const ex of EXERCISES) {
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      create: {
        name: ex.name,
        slug: ex.slug,
        primaryMuscle: ex.primaryMuscle,
        secondaryMuscles: JSON.stringify(ex.secondaryMuscles),
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        instructions: ex.instructions,
        isCustom: false,
      },
      update: {
        name: ex.name,
        primaryMuscle: ex.primaryMuscle,
        secondaryMuscles: JSON.stringify(ex.secondaryMuscles),
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        instructions: ex.instructions,
      },
    });
  }
}

async function seedUsers() {
  const demoPasswordHash = await hashPassword("password123");
  const demo = await prisma.user.upsert({
    where: { email: "demo@reprank.app" },
    create: {
      username: "demo",
      email: "demo@reprank.app",
      passwordHash: demoPasswordHash,
      bodyWeightKg: 78,
    },
    update: {},
  });

  const alex = await prisma.user.upsert({
    where: { email: "alex@reprank.app" },
    create: {
      username: "alex_lifts",
      email: "alex@reprank.app",
      passwordHash: demoPasswordHash,
      bodyWeightKg: 82,
    },
    update: {},
  });

  await prisma.friendship.upsert({
    where: { requesterId_addresseeId: { requesterId: demo.id, addresseeId: alex.id } },
    create: { requesterId: demo.id, addresseeId: alex.id, status: "ACCEPTED" },
    update: { status: "ACCEPTED" },
  });

  return { demo, alex };
}

async function seedRecipes(demoId: string, alexId: string) {
  console.log(`Seeding ${RECIPES.length} recipes...`);
  for (const recipe of RECIPES) {
    const authorId = recipe.author === "demo" ? demoId : alexId;
    const existing = await prisma.recipe.findFirst({
      where: { title: recipe.title, authorId },
    });
    if (existing) continue;
    await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: recipe.instructions,
        calories: recipe.calories,
        proteinG: recipe.proteinG,
        carbsG: recipe.carbsG,
        fatG: recipe.fatG,
        servings: recipe.servings,
        prepMinutes: recipe.prepMinutes,
        tags: JSON.stringify(recipe.tags),
        visibility: recipe.visibility,
        authorId,
      },
    });
  }
}

interface HistoryPlan {
  slug: string;
  startWeightKg: number;
  weeklyIncrementKg: number;
  repsRange: [number, number];
}

const DEMO_HISTORY: HistoryPlan[] = [
  { slug: "barbell-bench-press", startWeightKg: 60, weeklyIncrementKg: 1.25, repsRange: [5, 8] },
  { slug: "barbell-back-squat", startWeightKg: 80, weeklyIncrementKg: 2, repsRange: [5, 8] },
  { slug: "barbell-deadlift", startWeightKg: 100, weeklyIncrementKg: 2.5, repsRange: [3, 6] },
  { slug: "overhead-barbell-press", startWeightKg: 35, weeklyIncrementKg: 0.5, repsRange: [5, 8] },
  { slug: "pull-up", startWeightKg: 0, weeklyIncrementKg: 0, repsRange: [6, 12] },
  { slug: "barbell-bent-over-row", startWeightKg: 50, weeklyIncrementKg: 1, repsRange: [6, 10] },
  { slug: "dumbbell-hammer-curl", startWeightKg: 12, weeklyIncrementKg: 0.5, repsRange: [8, 12] },
  { slug: "standing-calf-raise", startWeightKg: 40, weeklyIncrementKg: 1, repsRange: [10, 15] },
];

const ALEX_HISTORY: HistoryPlan[] = [
  { slug: "barbell-bench-press", startWeightKg: 70, weeklyIncrementKg: 1, repsRange: [5, 8] },
  { slug: "barbell-back-squat", startWeightKg: 90, weeklyIncrementKg: 1.5, repsRange: [5, 8] },
  { slug: "romanian-deadlift", startWeightKg: 60, weeklyIncrementKg: 1.5, repsRange: [6, 10] },
  { slug: "lat-pulldown", startWeightKg: 55, weeklyIncrementKg: 1, repsRange: [8, 12] },
];

// A small deterministic pseudo-random generator so seeding is reproducible.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function seedHistory(userId: string, plans: HistoryPlan[], seed: number) {
  const rand = mulberry32(seed);
  const exercises = await prisma.exercise.findMany({
    where: { slug: { in: plans.map((p) => p.slug) } },
  });
  const bySlug = new Map(exercises.map((e) => [e.slug, e]));

  const weeks = 9;
  const sessionsPerWeek = 3;
  const today = new Date();

  // Build a chronological list of (date, plan) session events, oldest first.
  const events: { date: Date; plan: HistoryPlan; weekIndex: number }[] = [];
  for (let week = 0; week < weeks; week++) {
    for (let s = 0; s < sessionsPerWeek; s++) {
      const daysAgo = (weeks - week) * 7 - s * 2;
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      date.setHours(17, 30, 0, 0);
      // Rotate which lifts get trained each session for variety.
      const plansThisSession = plans.filter((_, i) => (i + s) % 2 === 0);
      for (const plan of plansThisSession) {
        events.push({ date, plan, weekIndex: week });
      }
    }
  }
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const event of events) {
    const exercise = bySlug.get(event.plan.slug);
    if (!exercise) continue;
    const isBodyweightOnly = event.plan.startWeightKg === 0 && event.plan.weeklyIncrementKg === 0;
    const [minReps, maxReps] = event.plan.repsRange;
    const repsProgress = isBodyweightOnly ? Math.floor(event.weekIndex / 3) : 0;
    const reps = repsProgress + minReps + Math.floor(rand() * (maxReps - minReps + 1));
    const weightKg = isBodyweightOnly
      ? 0
      : Math.max(
          0,
          Math.round(
            (event.plan.startWeightKg +
              event.plan.weeklyIncrementKg * event.weekIndex +
              (rand() - 0.3) * event.plan.weeklyIncrementKg) *
              2,
          ) / 2,
        );

    // Log 3 sets per session for this exercise.
    for (let set = 0; set < 3; set++) {
      const setDate = new Date(event.date);
      setDate.setMinutes(setDate.getMinutes() + set * 3);
      await logSetForUser({
        userId,
        exerciseId: exercise.id,
        weightKg,
        reps: Math.max(1, reps - set),
        at: setDate,
      });
    }
  }
}

async function main() {
  await seedExercises();
  const { demo, alex } = await seedUsers();
  await seedRecipes(demo.id, alex.id);

  const existingSets = await prisma.workoutSet.count({ where: { userId: demo.id } });
  if (existingSets === 0) {
    console.log("Seeding demo workout history...");
    await seedHistory(demo.id, DEMO_HISTORY, 42);
    await seedHistory(alex.id, ALEX_HISTORY, 99);
  } else {
    console.log("Workout history already present, skipping.");
  }

  console.log("Seed complete.");
  console.log("Demo login: demo@reprank.app / password123");
  console.log("Friend login: alex@reprank.app / password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
