"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAuth } from "@/lib/auth-context";
import { authErrorMessage } from "@/lib/auth-errors";

function LoginForm() {
  const { signInEmail, signInGoogle, configured } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("email");
    try {
      await signInEmail(email, password);
      router.replace(next);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(null);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading("google");
    try {
      await signInGoogle();
      router.replace(next);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to your advertiser account.</p>
        </div>

        {!configured ? (
          <Alert tone="warning" title="Firebase not configured">
            Add your Firebase keys to <code>.env.local</code> to enable sign-in.
          </Alert>
        ) : null}

        {error ? <Alert tone="danger">{error}</Alert> : null}

        <GoogleButton onClick={handleGoogle} loading={loading === "google"} label="Continue with Google" />

        <div className="flex items-center gap-3 text-xs text-muted-2">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={loading !== null}>
            {loading === "email" ? <Spinner /> : null}
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}

export default function LoginPageClient() {
  return (
    <Suspense fallback={<div className="flex justify-center py-10"><Spinner /></div>}>
      <LoginForm />
    </Suspense>
  );
}
