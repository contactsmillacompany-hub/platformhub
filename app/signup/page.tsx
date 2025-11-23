"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/projects");
        }}
      >
        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900"
            placeholder="••••••••"
            required
          />
        </div>
        <button className="w-full rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          Sign up
        </button>
      </form>
      <button
        onClick={() => router.push("/login")}
        className="w-full rounded-md border px-4 py-2 dark:border-neutral-800"
      >
        Already have an account? Sign in
      </button>
    </main>
  );
}
