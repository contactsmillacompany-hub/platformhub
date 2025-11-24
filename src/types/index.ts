// Project status type
export type ProjectStatus = 'ongoing' | 'completed' | 'archived'

// Project card interface (used in Dashboard component)
export interface ProjectCard {
  id: string
  name: string
  description: string
  status: ProjectStatus
  notes?: string
  updatedAt: string
  links: ProjectLink[]
}

// Project interface
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  notes?: string
  updatedAt: string
  links: ProjectLink[]
}

// Project link interface
export interface ProjectLink {
  id: string
  type: 'website' | 'github' | 'youtube' | 'instagram' | 'gitlab'
  label: string
  url: string
  icon: any
}

// Resource interface
export interface Resource {
  id: string
  name: string
  description: string
  type: string
  url?: string
  createdAt: string
}
