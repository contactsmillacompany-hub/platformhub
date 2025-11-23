'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Check, Clock, Archive, User, Settings, LogOut, FolderOpen, Trash2, AlertTriangle, Github as GitHub, X } from 'lucide-react'
import { Project, Resource } from '../src/types/index'
import { addProject, addResource, signOut, deleteProject, updateProjectStatus, deleteResource, updateProjectNotes } from '../src/app/actions'
import { Button } from '../src/components/ui/button'
import { Input } from '../src/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../src/components/ui/dropdown-menu'

// Project status type
type ProjectStatus = 'ongoing' | 'completed' | 'archived'

// Project card interface
interface ProjectCard {
  id: string
  name: string
  description: string
  status: ProjectStatus
  notes?: string
  updatedAt: string
  links: ProjectLink[]
}

// Project link interface
interface ProjectLink {
  id: string
  type: 'website' | 'github' | 'youtube' | 'instagram' | 'gitlab'
  label: string
  url: string
  icon: any
}

// Status configuration
const statusConfig = {
  ongoing: { text: 'Ongoing', color: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { text: 'Completed', color: 'bg-green-100 text-green-800', icon: Check },
  archived: { text: 'Archived', color: 'bg-gray-100 text-gray-800', icon: Archive }
}

// Icons for different platforms
const LinkIcon = ({ className }: { className?: string }) => <div className={className}>🔗</div>
const GitLabIcon = ({ className }: { className?: string }) => <div className={className}>🦊</div>
const YouTubeIcon = ({ className }: { className?: string }) => <div className={className}>📺</div>
const InstagramIcon = ({ className }: { className?: string }) => <div className={className}>📷</div>

export default function Dashboard() {
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectCard | null>(null)
  const [showAddLinkModal, setShowAddLinkModal] = useState(false)
  const [newLink, setNewLink] = useState({
    type: 'website' as const,
    label: '',
    url: ''
  })

  // Fetch user and projects data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await fetch('/api/user/profile')
        const userData = await userResponse.json()
        if (userData.user) {
          setUser(userData.user)
        }

        // Fetch projects from API
        const projectsResponse = await fetch('/api/projects')
        const projectsData = await projectsResponse.json()
        
        if (projectsResponse.status === 401) {
          console.error('Dashboard: Not authenticated')
          // Use mock data as fallback
          setProjects(getMockProjects())
        } else if (projectsData.error) {
          console.error('Dashboard: Projects fetch error:', projectsData.error)
          // Use mock data as fallback
          setProjects(getMockProjects())
        } else {
          console.log('Dashboard: Projects fetched successfully:', projectsData.projects?.length || 0)
          // Convert to ProjectCard format
          const projectCards = projectsData.projects.map(project => ({
            ...project,
            status: project.status || 'ongoing',
            updatedAt: project.updated_at ? new Date(project.updated_at).toLocaleString() : 'Unknown',
            description: project.description || 'No description available',
            links: project.resources ? project.resources.map(resource => ({
              id: resource.id,
              type: resource.platform as any,
              label: resource.label,
              url: resource.value,
              icon: getIconForPlatform(resource.platform)
            })) : []
          }))
          setProjects(projectCards)
        }
      } catch (error) {
        console.error('Dashboard: Fetch error:', error)
        // Use mock data as fallback
        setProjects(getMockProjects())
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper function to get mock data
  const getMockProjects = () => {
    return [
      {
        id: '1',
        name: 'PlatformHub Platform',
        description: 'Main platform for project management',
        status: 'ongoing' as const,
        updatedAt: '2h ago',
        links: []
      },
      {
        id: '2', 
        name: 'Mobile App',
        description: 'PlatformHub mobile application',
        status: 'completed' as const,
        updatedAt: '1d ago',
        links: []
      }
    ]
  }

  // Helper function to get icon for platform
  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'gitlab': return GitLabIcon
      case 'github': return GitHub
      case 'youtube': return YouTubeIcon
      case 'instagram': return InstagramIcon
      default: return LinkIcon
    }
  }

  // Set the first project as selected if none is selected and we have projects
  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0])
    }
  }, [projects, selectedProject])

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle project creation
  const handleCreateProject = async (projectData: { name: string; description: string }) => {
    try {
      const result = await addProject(projectData)
      if (result.error) {
        console.error('Error creating project:', result.error)
        return
      }
      
      // Refresh projects list
      window.location.reload()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    try {
      const result = await deleteProject(projectId)
      if (result.error) {
        console.error('Error deleting project:', result.error)
        return
      }
      
      // Refresh projects list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl text-gray-800">PlatformHub</div>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500">
              Projects: {projects.length} | User: {user?.email ? '✅' : '❌'}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100" suppressHydrationWarning>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.email ? user.email.split('@')[0] : 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-64">
              {/* User Profile Section */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email_confirmed ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              
              {/* Menu Items */}
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => window.location.href = '/reset-password-magic'}
              >
                <Settings className="w-4 h-4 mr-2" />
                Change Password
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Projects Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('ongoing')}>
                    Ongoing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('archived')}>
                    Archived
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{project.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusConfig[project.status].color
                        }`}>
                          {statusConfig[project.status].text}
                        </span>
                        <span className="text-xs text-gray-500">{project.updatedAt}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setProjectToDelete(project)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="flex-1 bg-white">
          {selectedProject ? (
            <div className="h-full flex flex-col">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
                    <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    statusConfig[selectedProject.status].color
                  }`}>
                    {statusConfig[selectedProject.status].text}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="flex-1 p-6">
                <div className="max-w-4xl">
                  {/* Links Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Links & Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.links.map(link => (
                        <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <link.icon className="w-5 h-5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{link.label}</p>
                            <p className="text-sm text-gray-500 truncate">{link.url}</p>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setShowAddLinkModal(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </Button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <p className="text-gray-700">
                        {selectedProject.notes || 'No notes added yet.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No project selected</h3>
                <p className="text-gray-500">Select a project from the sidebar to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{projectToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setProjectToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteProject(projectToDelete.id)
                  setProjectToDelete(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
