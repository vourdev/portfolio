import Link from "next/link";
import { navItems } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 bg-clip-text text-8xl font-bold text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-violet-400">
          404
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This page doesn&apos;t exist.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
