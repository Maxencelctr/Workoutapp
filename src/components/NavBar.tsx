import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const NAV_LINKS = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/exercises", label: "Exercises", icon: "🏋️" },
  { href: "/nutrition", label: "Nutrition", icon: "🍽️" },
  { href: "/friends", label: "Friends", icon: "👥" },
  { href: "/profile", label: "Profile", icon: "🧑" },
];

export function NavBar() {
  return (
    <>
      <header className="sticky top-0 z-20 hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur sm:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-lg font-bold text-emerald-400">
            RepRank
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-zinc-800 bg-zinc-950/95 backdrop-blur sm:hidden">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] text-zinc-400 transition hover:text-white"
          >
            <span className="text-lg leading-none">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
