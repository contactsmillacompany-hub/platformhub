import Link from "next/link";
import { getProjects } from "@/lib/dummyData";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/projects/new"
          className="rounded-md bg-black px-3 py-2 text-white dark:bg-white dark:text-black"
        >
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </main>
  );
}
