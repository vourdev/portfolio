"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/admin/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconArrowLeft } from "@tabler/icons-react";

const initial: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(59,130,246,0.18),transparent_55%)]" />
      <Card className="relative w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Sign in to the vour.dev admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                autoFocus
                placeholder="••••••••"
              />
            </div>
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <Link
            href="/"
            className="mt-5 flex items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft size={14} /> Back to site
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
