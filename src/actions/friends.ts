"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { usernameSchema } from "@/lib/validation";

export interface FriendFormState {
  error?: string;
  success?: string;
}

export async function sendFriendRequestAction(_prev: FriendFormState, formData: FormData): Promise<FriendFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = usernameSchema.safeParse(formData.get("username"));
  if (!parsed.success) return { error: "Enter a valid username" };

  const target = await prisma.user.findUnique({ where: { username: parsed.data } });
  if (!target) return { error: `No user named "${parsed.data}"` };
  if (target.id === user.id) return { error: "You can't friend yourself" };

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: user.id, addresseeId: target.id },
        { requesterId: target.id, addresseeId: user.id },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") return { error: `You're already friends with ${target.username}` };
    if (existing.status === "PENDING") return { error: "Friend request already pending" };
    // Previously declined — let them try again.
    await prisma.friendship.update({
      where: { id: existing.id },
      data: { requesterId: user.id, addresseeId: target.id, status: "PENDING" },
    });
  } else {
    await prisma.friendship.create({
      data: { requesterId: user.id, addresseeId: target.id, status: "PENDING" },
    });
  }

  revalidatePath("/friends");
  return { success: `Friend request sent to ${target.username}` };
}

async function respondToRequest(friendshipId: string, status: "ACCEPTED" | "DECLINED") {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
  if (!friendship || friendship.addresseeId !== user.id) return;

  await prisma.friendship.update({ where: { id: friendshipId }, data: { status } });
  revalidatePath("/friends");
}

export async function acceptFriendRequestAction(formData: FormData) {
  const id = String(formData.get("friendshipId") ?? "");
  if (id) await respondToRequest(id, "ACCEPTED");
}

export async function declineFriendRequestAction(formData: FormData) {
  const id = String(formData.get("friendshipId") ?? "");
  if (id) await respondToRequest(id, "DECLINED");
}
