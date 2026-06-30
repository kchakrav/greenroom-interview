"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dumbbell, Map, LineChart, Mic, GraduationCap, Database, Library } from "lucide-react";
import { loadProgress, xpForLevel, type Progress } from "@/components/gamify";
import UserMenu from "@/components/UserMenu";

const LINKS = [
  { href: "/", label: "Practice", icon: Mic },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/reference", label: "Reference", icon: Library },
  { href: "/drills", label: "Drills", icon: Dumbbell },
  { href: "/paths", label: "Paths", icon: Map },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/admin", label: "Admin", icon: Database },
];

export default function Nav() {
  const path = usePathname();
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => setP(loadProgress()), [path]);

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl btn-accent grid place-items-center text-sm font-bold">GR</div>
          <span className="text-lg font-semibold tracking-tight">GreenRoom</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${active ? "btn-accent" : "text-ink-secondary hover:text-ink-primary"}`}
              >
                <l.icon className="h-3.5 w-3.5" /> {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {p && (
          <div className="glass flex items-center gap-4 rounded-full px-4 py-2 text-sm">
            <span className="text-ink-secondary">Lvl <b className="text-ink-primary">{p.level}</b></span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
              <div className="h-full btn-accent" style={{ width: `${Math.min(100, (p.xp / xpForLevel(p.level)) * 100)}%` }} />
            </div>
            <span className="text-ink-secondary">🔥 {p.streak}d</span>
          </div>
        )}
        <UserMenu />
      </div>
    </header>
  );
}
