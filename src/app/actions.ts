'use server'

import { Project, Resource } from '../types/index'

// Mock actions for now - replace with actual implementation
export async function addProject(project: Omit<Project, 'id' | 'updatedAt'>) {
  console.log('Adding project:', project)
  return { success: true }
}

export async function addResource(resource: Omit<Resource, 'id' | 'createdAt'>) {
  console.log('Adding resource:', resource)
  return { success: true }
}

export async function signOut() {
  console.log('Signing out')
  return { success: true }
}

export async function deleteProject(id: string) {
  console.log('Deleting project:', id)
  return { success: true }
}

export async function updateProjectStatus(id: string, status: Project['status']) {
  console.log('Updating project status:', id, status)
  return { success: true }
}

export async function deleteResource(id: string) {
  console.log('Deleting resource:', id)
  return { success: true }
}

export async function updateProjectNotes(id: string, notes: string) {
  console.log('Updating project notes:', id, notes)
  return { success: true }
}
