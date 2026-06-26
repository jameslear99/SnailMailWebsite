"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAuth } from "@/lib/auth-context";
import { authErrorMessage } from "@/lib/auth-errors";

export default function SignupPage() {
  const { signUpEmail, signInGoogle, configured } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  // New accounts go to onboarding to create their business profile.
  const next = "/dashboard/onboarding";

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("email");
    try {
      await signUpEmail(email, password, name);
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
          <h1 className="text-2xl font-semibold tracking-tight">Create your advertiser account</h1>
          <p className="mt-1 text-sm text-muted">
            Build targeted physical mail campaigns. You&apos;re only charged after ads are printed
            and sent.
          </p>
        </div>

        {!configured ? (
          <Alert tone="warning" title="Firebase not configured">
            Add your Firebase keys to <code>.env.local</code> to enable sign-up.
          </Alert>
        ) : null}

        {error ? <Alert tone="danger">{error}</Alert> : null}

        <GoogleButton onClick={handleGoogle} loading={loading === "google"} label="Sign up with Google" />

        <div className="flex items-center gap-3 text-xs text-muted-2">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <Field label="Your name" htmlFor="name">
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Work email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="password" hint="at least 6 characters">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={loading !== null}>
            {loading === "email" ? <Spinner /> : null}
            Create account
          </Button>
        </form>

        <p className="text-center text-xs text-muted-2">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
