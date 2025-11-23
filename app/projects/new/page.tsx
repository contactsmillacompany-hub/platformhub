"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "@/lib/dummyData";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">New Project</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addProject({ title: title.trim(), description: description.trim() });
          router.push("/projects");
        }}
      >
        <div className="space-y-2">
          <label className="block text-sm">Title</label>
          <input
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Description</label>
          <textarea
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={4}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="rounded-md border px-4 py-2 dark:border-neutral-800"
          >
            Cancel
          </button>
        </div>
      </form>
      <p className="text-xs text-neutral-500">
        Data is in-memory and resets on reload. Supabase will persist data later.
      </p>
    </main>
  );
}
