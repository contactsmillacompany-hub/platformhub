"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getProjects, getItemsByProject, deleteProject, createProjectItem, deleteProjectItem, updateProjectItem, updateProject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, Plus, ExternalLink, Trash2, Edit, Search, Loader2, FolderOpen, 
  Link as LinkIcon, Github, Globe, Figma, Trello, Slack, Youtube, Instagram, 
  Twitter, Linkedin, Facebook, Mail, FileText, Database, Cloud, Code, 
  Smartphone, Monitor, Camera, Music, Video, ShoppingBag, CreditCard,
  MessageCircle, Calendar, BookOpen, Palette, Layers, Box, Zap, Eye, EyeOff, StickyNote
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project, ProjectItem } from "@/lib/types";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [newLink, setNewLink] = useState({ platform: '', link: '', notes: '' });
  const [editLink, setEditLink] = useState({ platform: '', link: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [savingLink, setSavingLink] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectData, setEditProjectData] = useState({ title: '', description: '' });
  const [visibleNotes, setVisibleNotes] = useState<Set<string>>(new Set());

  const toggleNoteVisibility = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisibleNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch projects if user is authenticated and auth is not loading
    if (authLoading || !user) return;
    
    const fetchProjects = async () => {
      try {
        // Small delay to ensure Supabase session is fully established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          // Try to restore previously selected project from localStorage
          const savedProjectId = localStorage.getItem('selectedProjectId');
          const savedProject = savedProjectId 
            ? data.find(p => p.id === savedProjectId) 
            : null;
          
          const projectToSelect = savedProject || data[0];
          setSelectedProject(projectToSelect);
          const items = await getItemsByProject(projectToSelect.id);
          setProjectItems(items);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user, authLoading]);

  // Save selected project to localStorage when it changes
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('selectedProjectId', selectedProject.id);
    }
  }, [selectedProject]);

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setLoadingItems(true);
    try {
      const items = await getItemsByProject(project.id);
      setProjectItems(items);
    } catch (error) {
      console.error('Failed to fetch project items:', error);
      setProjectItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleEditProject = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingProject(project);
    setEditProjectData({ title: project.title, description: project.description || '' });
    setIsEditProjectDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editProjectData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    setSavingLink(true);
    try {
      const updated = await updateProject(editingProject.id, {
        title: editProjectData.title.trim(),
        description: editProjectData.description.trim(),
      });
      if (updated) {
        const updatedProjects = await getProjects();
        setProjects(updatedProjects);
        if (selectedProject?.id === editingProject.id) {
          setSelectedProject(updated);
        }
        setIsEditProjectDialogOpen(false);
        setEditingProject(null);
        toast.success('Project updated');
      }
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteProject = async (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm('Delete this project?')) return;

    try {
      const isDeleted = await deleteProject(projectId);
      if (isDeleted) {
        const updatedProjects = await getProjects();
        setProjects(updatedProjects);
        if (selectedProject?.id === projectId) {
          if (updatedProjects.length > 0) {
            setSelectedProject(updatedProjects[0]);
            const items = await getItemsByProject(updatedProjects[0].id);
            setProjectItems(items);
          } else {
            setSelectedProject(null);
            setProjectItems([]);
          }
        }
        toast.success('Project deleted');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleAddLink = async () => {
    if (!selectedProject || !newLink.platform || !newLink.link) {
      toast.error('Please fill in all fields');
      return;
    }
    setSavingLink(true);
    try {
      const newItem = await createProjectItem({
        projectId: selectedProject.id,
        platform: newLink.platform,
        link: newLink.link,
        notes: newLink.notes,
        username: undefined,
        email: undefined
      });
      if (newItem) {
        const updatedItems = await getItemsByProject(selectedProject.id);
        setProjectItems(updatedItems);
        setNewLink({ platform: '', link: '', notes: '' });
        setIsAddLinkDialogOpen(false);
        toast.success('Link added');
      }
    } catch (error) {
      toast.error('Failed to add link');
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteItem = async (itemId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('Delete this link?')) return;
    try {
      const isDeleted = await deleteProjectItem(itemId);
      if (isDeleted) {
        const updatedItems = await getItemsByProject(selectedProject!.id);
        setProjectItems(updatedItems);
        toast.success('Link deleted');
      }
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const handleEditItem = (item: ProjectItem, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setEditingItem(item);
    setEditLink({
      platform: item.platform,
      link: item.link || '',
      notes: item.notes || ''
    });
    setIsEditLinkDialogOpen(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editLink.platform) {
      toast.error('Please fill in platform');
      return;
    }
    setSavingLink(true);
    try {
      const updatedItem = await updateProjectItem(editingItem.id, {
        platform: editLink.platform,
        link: editLink.link || undefined,
        notes: editLink.notes,
      });
      if (updatedItem) {
        const updatedItems = await getItemsByProject(editingItem.projectId);
        setProjectItems(updatedItems);
        setEditingItem(null);
        setEditLink({ platform: '', link: '', notes: '' });
        setIsEditLinkDialogOpen(false);
        toast.success('Link updated');
      }
    } catch (error) {
      toast.error('Failed to update link');
    } finally {
      setSavingLink(false);
    }
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      ongoing: 'bg-amber-300',
      completed: 'bg-emerald-300',
      archived: 'bg-zinc-300',
    };
    return colors[status] || 'bg-zinc-300';
  };

  const getPlatformIcon = (platform: string) => {
    const name = platform.toLowerCase();
    const iconClass = "h-4 w-4";
    
    // Development & Code
    if (name.includes('github')) return <Github className={iconClass} />;
    if (name.includes('vercel') || name.includes('netlify') || name.includes('deploy')) return <Cloud className={iconClass} />;
    if (name.includes('code') || name.includes('vscode') || name.includes('replit')) return <Code className={iconClass} />;
    if (name.includes('database') || name.includes('supabase') || name.includes('firebase') || name.includes('mongo')) return <Database className={iconClass} />;
    if (name.includes('api') || name.includes('postman')) return <Zap className={iconClass} />;
    
    // Design
    if (name.includes('figma')) return <Figma className={iconClass} />;
    if (name.includes('design') || name.includes('sketch') || name.includes('adobe') || name.includes('canva')) return <Palette className={iconClass} />;
    if (name.includes('dribbble') || name.includes('behance')) return <Layers className={iconClass} />;
    
    // Project Management
    if (name.includes('trello')) return <Trello className={iconClass} />;
    if (name.includes('notion') || name.includes('docs') || name.includes('document')) return <FileText className={iconClass} />;
    if (name.includes('slack')) return <Slack className={iconClass} />;
    if (name.includes('discord') || name.includes('chat')) return <MessageCircle className={iconClass} />;
    if (name.includes('calendar') || name.includes('meet') || name.includes('zoom')) return <Calendar className={iconClass} />;
    
    // Social Media
    if (name.includes('youtube')) return <Youtube className={iconClass} />;
    if (name.includes('instagram')) return <Instagram className={iconClass} />;
    if (name.includes('twitter') || name.includes('x.com')) return <Twitter className={iconClass} />;
    if (name.includes('linkedin')) return <Linkedin className={iconClass} />;
    if (name.includes('facebook')) return <Facebook className={iconClass} />;
    if (name.includes('tiktok')) return <Video className={iconClass} />;
    
    // Media
    if (name.includes('video') || name.includes('vimeo') || name.includes('loom')) return <Video className={iconClass} />;
    if (name.includes('photo') || name.includes('image') || name.includes('unsplash')) return <Camera className={iconClass} />;
    if (name.includes('music') || name.includes('spotify') || name.includes('audio')) return <Music className={iconClass} />;
    
    // Business
    if (name.includes('mail') || name.includes('email') || name.includes('gmail')) return <Mail className={iconClass} />;
    if (name.includes('shop') || name.includes('store') || name.includes('shopify')) return <ShoppingBag className={iconClass} />;
    if (name.includes('stripe') || name.includes('payment') || name.includes('paypal')) return <CreditCard className={iconClass} />;
    
    // Apps & Platforms
    if (name.includes('app') || name.includes('mobile') || name.includes('ios') || name.includes('android')) return <Smartphone className={iconClass} />;
    if (name.includes('web') || name.includes('site') || name.includes('landing')) return <Monitor className={iconClass} />;
    if (name.includes('book') || name.includes('read') || name.includes('medium')) return <BookOpen className={iconClass} />;
    if (name.includes('3d') || name.includes('blender')) return <Box className={iconClass} />;
    
    // Default
    if (name.includes('link') || name.includes('url')) return <LinkIcon className={iconClass} />;
    return <Globe className={iconClass} />;
  };

  const getPlatformColor = (platform: string) => {
    const name = platform.toLowerCase();
    
    // Minimal muted colors - subtle and professional
    if (name.includes('github')) return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
    if (name.includes('vercel') || name.includes('netlify')) return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
    if (name.includes('figma') || name.includes('design')) return 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400';
    if (name.includes('notion') || name.includes('docs')) return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
    if (name.includes('slack') || name.includes('discord')) return 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400';
    if (name.includes('youtube') || name.includes('video')) return 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400';
    if (name.includes('instagram') || name.includes('tiktok')) return 'bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400';
    if (name.includes('twitter') || name.includes('x.com')) return 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400';
    if (name.includes('linkedin')) return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400';
    if (name.includes('facebook')) return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400';
    if (name.includes('trello') || name.includes('jira')) return 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400';
    if (name.includes('supabase') || name.includes('database')) return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400';
    if (name.includes('firebase')) return 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400';
    if (name.includes('stripe') || name.includes('payment')) return 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400';
    if (name.includes('mail') || name.includes('email')) return 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400';
    if (name.includes('calendar') || name.includes('meet')) return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400';
    if (name.includes('shop') || name.includes('store')) return 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400';
    if (name.includes('code') || name.includes('api')) return 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400';
    if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) return 'bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400';
    
    return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400';
  };

  // Show loading while checking auth or loading projects
  if (authLoading || loading || !user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-100 dark:border-zinc-800/50 flex flex-col bg-zinc-50/30 dark:bg-zinc-900/30">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Projects</span>
            <Link href="/projects/new">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-sm">
              {searchQuery ? 'No results' : 'No projects yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all ${
                    selectedProject?.id === project.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${getStatusDot(project.status)}`} />
                        <h3 className="font-medium text-sm truncate">{project.title}</h3>
                      </div>
                      {project.description && (
                        <p className={`text-xs mt-1 truncate ${
                          selectedProject?.id === project.id 
                            ? 'text-zinc-500 dark:text-zinc-400' 
                            : 'text-zinc-400'
                        }`}>
                          {project.description}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            selectedProject?.id === project.id 
                              ? 'hover:bg-zinc-200 dark:hover:bg-zinc-700' 
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={(e) => handleEditProject(project, e)}
                          className="text-xs"
                        >
                          <Edit className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="text-red-600 focus:text-red-600 text-xs"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {selectedProject ? (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{selectedProject.title}</h1>
                    <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(selectedProject.status)}`} />
                  </div>
                  {selectedProject.description && (
                    <p className="text-zinc-500 mt-1 text-sm max-w-xl">{selectedProject.description}</p>
                  )}
                </div>
                <Button
                  onClick={() => setIsAddLinkDialogOpen(true)}
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-zinc-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Link
                </Button>
              </div>
            </div>

            {/* Links Grid */}
            <div className="flex-1 overflow-y-auto p-8">
              {loadingItems ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                </div>
              ) : projectItems.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {projectItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !item.link && e.preventDefault()}
                      className="group block p-4 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getPlatformColor(item.platform)}`}>
                            {getPlatformIcon(item.platform)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{item.platform}</h4>
                            {item.link && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                {item.link.replace(/^https?:\/\//, '')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => handleEditItem(item, e)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:text-red-600"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          {item.link && <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                          <button
                            onClick={(e) => toggleNoteVisibility(item.id, e)}
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                          >
                            {visibleNotes.has(item.id) ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Hide note</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>Show note</span>
                              </>
                            )}
                          </button>
                          {visibleNotes.has(item.id) && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                    <LinkIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">No links yet</h3>
                  <p className="text-sm text-zinc-500 mt-1 mb-4">Add your first link to get started</p>
                  <Button
                    onClick={() => setIsAddLinkDialogOpen(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Link
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <FolderOpen className="h-5 w-5 text-zinc-400" />
            </div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Select a project</h3>
            <p className="text-sm text-zinc-500 mt-1">Choose a project from the sidebar to view its links</p>
          </div>
        )}
      </main>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Platform</label>
              <input
                type="text"
                placeholder="e.g., GitHub, Figma, Notion"
                className="w-full mt-1.5 h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <input
                type="url"
                placeholder="https://"
                className="w-full mt-1.5 h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                value={newLink.link}
                onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes <span className="text-zinc-400 font-normal">(optional)</span></label>
              <textarea
                placeholder="Add a note..."
                rows={2}
                className="w-full mt-1.5 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                value={newLink.notes}
                onChange={(e) => setNewLink({ ...newLink, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddLink}
                disabled={savingLink}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
              >
                {savingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddLinkDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Link Dialog */}
      <Dialog open={isEditLinkDialogOpen} onOpenChange={setIsEditLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Platform</label>
              <input
                type="text"
                className="w-full mt-1.5 h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                value={editLink.platform}
                onChange={(e) => setEditLink({ ...editLink, platform: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <input
                type="url"
                className="w-full mt-1.5 h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                value={editLink.link}
                onChange={(e) => setEditLink({ ...editLink, link: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                rows={2}
                className="w-full mt-1.5 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                value={editLink.notes}
                onChange={(e) => setEditLink({ ...editLink, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleUpdateItem}
                disabled={savingLink}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
              >
                {savingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditLinkDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-full mt-1.5 h-9 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                value={editProjectData.title}
                onChange={(e) => setEditProjectData({ ...editProjectData, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description <span className="text-zinc-400 font-normal">(optional)</span></label>
              <textarea
                rows={3}
                className="w-full mt-1.5 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                value={editProjectData.description}
                onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })}
                placeholder="What's this project about?"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleUpdateProject}
                disabled={savingLink}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
              >
                {savingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditProjectDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
