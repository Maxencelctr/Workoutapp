import { NewExerciseForm } from "@/components/NewExerciseForm";

export default function NewExercisePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-white">Add a custom exercise</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Not in our library yet? Add it and start ranking it right away.
      </p>
      <NewExerciseForm />
    </div>
  );
}
