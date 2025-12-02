export type ProjectStatus = "ongoing" | "completed" | "archived";

export interface Project {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  projectId: string;
  platform: string;
  username?: string;
  email?: string;
  link?: string;
  notes?: string;
  createdAt: string;
}
