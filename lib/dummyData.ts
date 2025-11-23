import { Project, ProjectItem } from "./types";

export const platforms = [
  "Instagram",
  "YouTube",
  "GitHub",
  "GitLab",
  "Firebase",
  "Vercel",
  "AWS",
  "GCP",
] as const;

let projects: Project[] = [
  {
    id: "p1",
    title: "Personal Portfolio",
    description: "Website and social accounts",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Mobile App",
    description: "App infra and releases",
    status: "paused",
    createdAt: new Date().toISOString(),
  },
];

let items: ProjectItem[] = [
  {
    id: "i1",
    projectId: "p1",
    platform: "GitHub",
    username: "your-handle",
    link: "https://github.com/",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i2",
    projectId: "p1",
    platform: "Vercel",
    link: "https://vercel.com/dashboard",
    createdAt: new Date().toISOString(),
  },
];

export const getProjects = () => projects;
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getItemsByProject = (projectId: string) =>
  items.filter((i) => i.projectId === projectId);

export const addProject = (data: Pick<Project, "title" | "description">) => {
  const p: Project = {
    id: Math.random().toString(36).slice(2, 9),
    title: data.title,
    description: data.description,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  projects = [p, ...projects];
  return p;
};

export const addItem = (
  projectId: string,
  data: Omit<ProjectItem, "id" | "projectId" | "createdAt">
) => {
  const i: ProjectItem = {
    id: Math.random().toString(36).slice(2, 9),
    projectId,
    createdAt: new Date().toISOString(),
    ...data,
  };
  items = [i, ...items];
  return i;
};
