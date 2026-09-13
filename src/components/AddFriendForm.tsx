"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendFriendRequestAction, type FriendFormState } from "@/actions/friends";

const initialState: FriendFormState = {};

export function AddFriendForm() {
  const [state, formAction, pending] = useActionState(sendFriendRequestAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <input
          name="username"
          placeholder="Username"
          required
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {pending ? "Sending..." : "Add friend"}
        </button>
      </div>
      {state.error && <p className="text-xs text-red-400">{state.error}</p>}
      {state.success && <p className="text-xs text-emerald-400">{state.success}</p>}
    </form>
  );
}
