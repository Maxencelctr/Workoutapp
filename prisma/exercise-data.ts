import type { Difficulty, Equipment, MuscleGroup } from "../src/lib/constants";

export interface SeedExercise {
  name: string;
  slug: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  instructions: string;
}

export const EXERCISES: SeedExercise[] = [
  // Chest
  {
    name: "Barbell Bench Press",
    slug: "barbell-bench-press",
    primaryMuscle: "CHEST",
    secondaryMuscles: ["TRICEPS", "SHOULDERS"],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower it to mid-chest with control, then press back up to lockout.",
  },
  {
    name: "Incline Dumbbell Press",
    slug: "incline-dumbbell-press",
    primaryMuscle: "CHEST",
    secondaryMuscles: ["SHOULDERS", "TRICEPS"],
    equipment: "DUMBBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Set a bench to 30-45 degrees. Press two dumbbells from shoulder height straight up, then lower under control to a stretch at the bottom.",
  },
  {
    name: "Push-Up",
    slug: "push-up",
    primaryMuscle: "CHEST",
    secondaryMuscles: ["TRICEPS", "CORE"],
    equipment: "BODYWEIGHT",
    difficulty: "BEGINNER",
    instructions:
      "Hands under shoulders, body in a straight line. Lower your chest to just above the floor, then press back up without letting your hips sag.",
  },
  {
    name: "Cable Fly",
    slug: "cable-fly",
    primaryMuscle: "CHEST",
    secondaryMuscles: ["SHOULDERS"],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "Stand centered between two cable stacks set at chest height. With a slight elbow bend, sweep both handles together in front of your chest.",
  },
  {
    name: "Weighted Dip",
    slug: "weighted-dip",
    primaryMuscle: "CHEST",
    secondaryMuscles: ["TRICEPS", "SHOULDERS"],
    equipment: "BODYWEIGHT",
    difficulty: "ADVANCED",
    instructions:
      "Lean forward on parallel bars, lower until your shoulders are below your elbows, then press back up. Add weight via a dip belt as you progress.",
  },
  // Back
  {
    name: "Barbell Deadlift",
    slug: "barbell-deadlift",
    primaryMuscle: "BACK",
    secondaryMuscles: ["HAMSTRINGS", "GLUTES", "TRAPS", "CORE"],
    equipment: "BARBELL",
    difficulty: "ADVANCED",
    instructions:
      "Stand with the bar over mid-foot, hinge to grip it, flat back. Drive through the floor, keeping the bar close, and stand tall to lockout.",
  },
  {
    name: "Pull-Up",
    slug: "pull-up",
    primaryMuscle: "BACK",
    secondaryMuscles: ["BICEPS", "FOREARMS"],
    equipment: "BODYWEIGHT",
    difficulty: "INTERMEDIATE",
    instructions:
      "Hang from a bar with an overhand grip slightly wider than shoulders. Pull your chin over the bar, then lower with control to a full hang.",
  },
  {
    name: "Barbell Bent-Over Row",
    slug: "barbell-bent-over-row",
    primaryMuscle: "BACK",
    secondaryMuscles: ["BICEPS", "TRAPS"],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Hinge at the hips to about 45 degrees, flat back. Pull the bar to your lower ribs, squeezing your shoulder blades, then lower under control.",
  },
  {
    name: "Lat Pulldown",
    slug: "lat-pulldown",
    primaryMuscle: "BACK",
    secondaryMuscles: ["BICEPS"],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "Grip the bar wider than shoulders. Pull it to your upper chest while leaning back slightly, then let it rise back to full arm extension.",
  },
  {
    name: "Single-Arm Dumbbell Row",
    slug: "single-arm-dumbbell-row",
    primaryMuscle: "BACK",
    secondaryMuscles: ["BICEPS", "TRAPS"],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Support yourself on a bench with one hand and knee. Row the dumbbell to your hip, elbow close to your body, then lower fully.",
  },
  {
    name: "Seated Cable Row",
    slug: "seated-cable-row",
    primaryMuscle: "BACK",
    secondaryMuscles: ["BICEPS", "TRAPS"],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "Sit with knees slightly bent, grip the handle, and pull it to your stomach while keeping your back upright, then extend forward with control.",
  },
  // Shoulders
  {
    name: "Overhead Barbell Press",
    slug: "overhead-barbell-press",
    primaryMuscle: "SHOULDERS",
    secondaryMuscles: ["TRICEPS", "CORE"],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Bar at shoulder height, brace your core, and press straight overhead until your arms lock out, then lower back to your shoulders.",
  },
  {
    name: "Dumbbell Lateral Raise",
    slug: "dumbbell-lateral-raise",
    primaryMuscle: "SHOULDERS",
    secondaryMuscles: ["TRAPS"],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "With a slight elbow bend, raise both dumbbells out to the sides until level with your shoulders, then lower slowly.",
  },
  {
    name: "Arnold Press",
    slug: "arnold-press",
    primaryMuscle: "SHOULDERS",
    secondaryMuscles: ["TRICEPS"],
    equipment: "DUMBBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Start with palms facing you at shoulder height, rotate and press overhead as your palms turn outward, then reverse on the way down.",
  },
  {
    name: "Face Pull",
    slug: "face-pull",
    primaryMuscle: "SHOULDERS",
    secondaryMuscles: ["TRAPS", "BACK"],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "Set a rope at head height. Pull it toward your face, flaring your elbows out and squeezing your rear delts, then return with control.",
  },
  {
    name: "Dumbbell Rear Delt Fly",
    slug: "dumbbell-rear-delt-fly",
    primaryMuscle: "SHOULDERS",
    secondaryMuscles: ["BACK"],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Hinge forward with a flat back. Raise the dumbbells out to the sides, squeezing your shoulder blades together, then lower slowly.",
  },
  // Biceps
  {
    name: "Barbell Curl",
    slug: "barbell-curl",
    primaryMuscle: "BICEPS",
    secondaryMuscles: ["FOREARMS"],
    equipment: "BARBELL",
    difficulty: "BEGINNER",
    instructions:
      "Stand tall, elbows pinned to your sides. Curl the bar up to shoulder height, then lower under control without swinging.",
  },
  {
    name: "Dumbbell Hammer Curl",
    slug: "dumbbell-hammer-curl",
    primaryMuscle: "BICEPS",
    secondaryMuscles: ["FOREARMS"],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Hold dumbbells with a neutral (palms-in) grip. Curl straight up keeping your wrists fixed, then lower slowly.",
  },
  {
    name: "Incline Dumbbell Curl",
    slug: "incline-dumbbell-curl",
    primaryMuscle: "BICEPS",
    secondaryMuscles: ["FOREARMS"],
    equipment: "DUMBBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Sit back on an incline bench, arms hanging fully. Curl the dumbbells up without letting your elbows drift forward.",
  },
  {
    name: "Cable Curl",
    slug: "cable-curl",
    primaryMuscle: "BICEPS",
    secondaryMuscles: ["FOREARMS"],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "Using a straight or EZ bar attachment, curl the cable up while keeping constant tension, then lower with control.",
  },
  // Triceps
  {
    name: "Close-Grip Bench Press",
    slug: "close-grip-bench-press",
    primaryMuscle: "TRICEPS",
    secondaryMuscles: ["CHEST", "SHOULDERS"],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Grip the bar shoulder-width apart, lower it to your lower chest keeping elbows tucked, then press back up.",
  },
  {
    name: "Triceps Pushdown",
    slug: "triceps-pushdown",
    primaryMuscle: "TRICEPS",
    secondaryMuscles: [],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "Elbows pinned to your sides, push the bar or rope down until your arms are straight, then let it rise back to 90 degrees.",
  },
  {
    name: "Barbell Skull Crusher",
    slug: "barbell-skull-crusher",
    primaryMuscle: "TRICEPS",
    secondaryMuscles: [],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Lying on a bench, lower the bar toward your forehead by bending only at the elbows, then extend back to full lockout.",
  },
  {
    name: "Overhead Dumbbell Extension",
    slug: "overhead-dumbbell-extension",
    primaryMuscle: "TRICEPS",
    secondaryMuscles: [],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Hold one dumbbell overhead with both hands. Lower it behind your head by bending your elbows, then extend back up.",
  },
  {
    name: "Bench Dip",
    slug: "bench-dip",
    primaryMuscle: "TRICEPS",
    secondaryMuscles: ["CHEST", "SHOULDERS"],
    equipment: "BODYWEIGHT",
    difficulty: "BEGINNER",
    instructions:
      "Hands on a bench behind you, legs extended. Lower your hips toward the floor by bending your elbows, then press back up.",
  },
  // Forearms
  {
    name: "Barbell Wrist Curl",
    slug: "barbell-wrist-curl",
    primaryMuscle: "FOREARMS",
    secondaryMuscles: [],
    equipment: "BARBELL",
    difficulty: "BEGINNER",
    instructions:
      "Rest your forearms on your thighs or a bench, palms up. Curl the bar up using only your wrists, then lower fully.",
  },
  {
    name: "Farmer's Carry",
    slug: "farmers-carry",
    primaryMuscle: "FOREARMS",
    secondaryMuscles: ["TRAPS", "CORE"],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Grip a heavy dumbbell in each hand and walk with tall posture and a tight core for distance or time.",
  },
  {
    name: "Barbell Reverse Curl",
    slug: "barbell-reverse-curl",
    primaryMuscle: "FOREARMS",
    secondaryMuscles: ["BICEPS"],
    equipment: "BARBELL",
    difficulty: "BEGINNER",
    instructions:
      "With an overhand grip, curl the bar up while keeping your wrists straight, then lower under control.",
  },
  // Core
  {
    name: "Plank",
    slug: "plank",
    primaryMuscle: "CORE",
    secondaryMuscles: [],
    equipment: "BODYWEIGHT",
    difficulty: "BEGINNER",
    instructions:
      "Forearms and toes on the floor, body in a straight line from head to heels. Brace your abs and hold.",
  },
  {
    name: "Hanging Leg Raise",
    slug: "hanging-leg-raise",
    primaryMuscle: "CORE",
    secondaryMuscles: [],
    equipment: "BODYWEIGHT",
    difficulty: "ADVANCED",
    instructions:
      "Hang from a bar and raise your legs (straight or bent) until roughly parallel to the floor, then lower with control.",
  },
  {
    name: "Cable Crunch",
    slug: "cable-crunch",
    primaryMuscle: "CORE",
    secondaryMuscles: [],
    equipment: "CABLE",
    difficulty: "INTERMEDIATE",
    instructions:
      "Kneel below a high cable, rope behind your head. Crunch down by curling your torso toward your hips, then return slowly.",
  },
  {
    name: "Russian Twist",
    slug: "russian-twist",
    primaryMuscle: "CORE",
    secondaryMuscles: [],
    equipment: "BODYWEIGHT",
    difficulty: "BEGINNER",
    instructions:
      "Sit with knees bent and torso leaned back slightly. Rotate side to side, tapping the floor beside your hips.",
  },
  {
    name: "Ab Wheel Rollout",
    slug: "ab-wheel-rollout",
    primaryMuscle: "CORE",
    secondaryMuscles: ["SHOULDERS"],
    equipment: "BODYWEIGHT",
    difficulty: "ADVANCED",
    instructions:
      "From your knees, roll the wheel forward while keeping your core braced and back flat, then pull back to start.",
  },
  // Quadriceps
  {
    name: "Barbell Back Squat",
    slug: "barbell-back-squat",
    primaryMuscle: "QUADRICEPS",
    secondaryMuscles: ["GLUTES", "HAMSTRINGS", "CORE"],
    equipment: "BARBELL",
    difficulty: "ADVANCED",
    instructions:
      "Bar on your upper back, feet shoulder-width. Squat down until hips are below knees, then drive up through your heels.",
  },
  {
    name: "Leg Press",
    slug: "leg-press",
    primaryMuscle: "QUADRICEPS",
    secondaryMuscles: ["GLUTES", "HAMSTRINGS"],
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    instructions:
      "Feet shoulder-width on the platform. Lower until your knees reach about 90 degrees, then press back up without locking out hard.",
  },
  {
    name: "Dumbbell Walking Lunge",
    slug: "dumbbell-walking-lunge",
    primaryMuscle: "QUADRICEPS",
    secondaryMuscles: ["GLUTES", "HAMSTRINGS"],
    equipment: "DUMBBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Holding dumbbells at your sides, step forward into a lunge, drive through the front heel to stand, and alternate legs.",
  },
  {
    name: "Leg Extension",
    slug: "leg-extension",
    primaryMuscle: "QUADRICEPS",
    secondaryMuscles: [],
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    instructions:
      "Sit with the pad on your shins. Extend your legs until straight, squeeze your quads, then lower with control.",
  },
  {
    name: "Barbell Front Squat",
    slug: "barbell-front-squat",
    primaryMuscle: "QUADRICEPS",
    secondaryMuscles: ["CORE", "GLUTES"],
    equipment: "BARBELL",
    difficulty: "ADVANCED",
    instructions:
      "Rack the bar across your front shoulders, elbows high. Squat down staying upright, then drive back to standing.",
  },
  // Hamstrings
  {
    name: "Romanian Deadlift",
    slug: "romanian-deadlift",
    primaryMuscle: "HAMSTRINGS",
    secondaryMuscles: ["GLUTES", "BACK"],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Holding the bar at hip height, hinge back with a soft knee bend until you feel a hamstring stretch, then drive your hips forward.",
  },
  {
    name: "Lying Leg Curl",
    slug: "lying-leg-curl",
    primaryMuscle: "HAMSTRINGS",
    secondaryMuscles: [],
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    instructions:
      "Lie face down with the pad on your ankles. Curl your heels toward your glutes, then lower with control.",
  },
  {
    name: "Barbell Good Morning",
    slug: "barbell-good-morning",
    primaryMuscle: "HAMSTRINGS",
    secondaryMuscles: ["GLUTES", "BACK"],
    equipment: "BARBELL",
    difficulty: "ADVANCED",
    instructions:
      "Bar on your upper back, soft knees. Hinge forward at the hips until your torso is near parallel, then return to standing.",
  },
  // Glutes
  {
    name: "Barbell Hip Thrust",
    slug: "barbell-hip-thrust",
    primaryMuscle: "GLUTES",
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: "BARBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Upper back against a bench, bar over your hips. Drive through your heels to raise your hips until your body is a straight line.",
  },
  {
    name: "Glute Bridge",
    slug: "glute-bridge",
    primaryMuscle: "GLUTES",
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: "BODYWEIGHT",
    difficulty: "BEGINNER",
    instructions:
      "Lying on your back, knees bent. Squeeze your glutes to raise your hips off the floor, hold briefly, then lower.",
  },
  {
    name: "Cable Glute Kickback",
    slug: "cable-glute-kickback",
    primaryMuscle: "GLUTES",
    secondaryMuscles: ["HAMSTRINGS"],
    equipment: "CABLE",
    difficulty: "BEGINNER",
    instructions:
      "With an ankle cuff attached to a low cable, kick your leg back and up, squeezing your glute, then return with control.",
  },
  {
    name: "Dumbbell Bulgarian Split Squat",
    slug: "dumbbell-bulgarian-split-squat",
    primaryMuscle: "GLUTES",
    secondaryMuscles: ["QUADRICEPS", "HAMSTRINGS"],
    equipment: "DUMBBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Rear foot elevated on a bench, dumbbells at your sides. Lower until your front thigh is parallel, then drive back up.",
  },
  // Calves
  {
    name: "Standing Calf Raise",
    slug: "standing-calf-raise",
    primaryMuscle: "CALVES",
    secondaryMuscles: [],
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    instructions:
      "Balls of your feet on the platform. Rise onto your toes as high as possible, pause, then lower for a full stretch.",
  },
  {
    name: "Seated Calf Raise",
    slug: "seated-calf-raise",
    primaryMuscle: "CALVES",
    secondaryMuscles: [],
    equipment: "MACHINE",
    difficulty: "BEGINNER",
    instructions:
      "Pads on your knees, balls of your feet on the platform. Raise your heels as high as you can, then lower fully.",
  },
  {
    name: "Dumbbell Calf Raise",
    slug: "dumbbell-calf-raise",
    primaryMuscle: "CALVES",
    secondaryMuscles: [],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Holding dumbbells at your sides, stand on the edge of a step and raise your heels as high as possible, then lower below the step.",
  },
  // Traps
  {
    name: "Barbell Shrug",
    slug: "barbell-shrug",
    primaryMuscle: "TRAPS",
    secondaryMuscles: ["FOREARMS"],
    equipment: "BARBELL",
    difficulty: "BEGINNER",
    instructions:
      "Holding the bar in front of you, shrug your shoulders straight up toward your ears, pause, then lower with control.",
  },
  {
    name: "Dumbbell Shrug",
    slug: "dumbbell-shrug",
    primaryMuscle: "TRAPS",
    secondaryMuscles: ["FOREARMS"],
    equipment: "DUMBBELL",
    difficulty: "BEGINNER",
    instructions:
      "Holding a dumbbell in each hand, shrug your shoulders straight up, pause at the top, then lower slowly.",
  },
  {
    name: "Kettlebell Swing",
    slug: "kettlebell-swing",
    primaryMuscle: "TRAPS",
    secondaryMuscles: ["GLUTES", "HAMSTRINGS", "CORE", "BACK"],
    equipment: "KETTLEBELL",
    difficulty: "INTERMEDIATE",
    instructions:
      "Hinge and hike the kettlebell back between your legs, then snap your hips forward to swing it to chest height.",
  },
];
