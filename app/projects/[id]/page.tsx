import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getItemsByProject } from "@/lib/dummyData";
import ItemCard from "@/components/ItemCard";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return notFound();
  const items = getItemsByProject(project.id);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          {project.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {project.description}
            </p>
          )}
          <p className="text-xs text-neutral-500">Status: {project.status}</p>
        </div>
        <Link
          href="/projects"
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          Back
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Items</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
          {items.length === 0 && (
            <p className="text-sm text-neutral-500">No items yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
