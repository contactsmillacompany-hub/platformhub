import { supabase } from "./supabaseClient";
import { Project, ProjectItem } from "./types";
import { getProjects as getDummyProjects } from "./dummyData";

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  
  // First try to get user from session (faster)
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return session.user.id;
  }
  
  // Fallback to getUser
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Projects
export async function getProjects(): Promise<Project[]> {
  try {
    console.log('=== FETCHING REAL DATA FROM SUPABASE ===');
    
    // Check if environment variables are loaded
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment variables:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl?.substring(0, 20) + '...',
      keyLength: supabaseKey?.length
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Environment variables are missing');
      return getDummyProjects();
    }

    console.log('🔄 Connecting to Supabase database...');
    
    if (!supabase) {
      console.error('❌ Supabase client is null');
      return getDummyProjects();
    }

    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('❌ No authenticated user');
      return [];
    }

    try {
      // First, check if user_id column exists by trying to fetch with it
      let data, error;
      
      // Try fetching with user_id filter
      const result = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      data = result.data;
      error = result.error;
      
      // If error (possibly user_id column doesn't exist), try without filter
      if (error) {
        console.warn('⚠️ Could not filter by user_id, trying without filter:', error.message);
        
        // Fallback: fetch all and filter client-side, or fetch without user_id filter
        const fallbackResult = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackResult.error) {
          console.error('❌ Database error:', fallbackResult.error);
          console.error('Error message:', fallbackResult.error.message);
          console.error('Error code:', fallbackResult.error.code);
          return getDummyProjects();
        }
        
        // Filter client-side if user_id exists on records
        data = fallbackResult.data?.filter((p: any) => !p.user_id || p.user_id === userId) || [];
      }

      console.log('✅ Successfully connected to Supabase!');
      console.log('📊 Found', data?.length, 'projects in database for user:', userId);
      
      return data?.map((project: any) => ({
        id: project.id,
        userId: project.user_id,
        title: project.name || project.title,
        description: project.description,
        status: project.status as Project['status'],
        createdAt: project.created_at,
        updatedAt: project.updated_at || project.created_at,
      })) || [];
      
    } catch (supabaseError) {
      console.error('❌ Network error:', supabaseError);
      console.error('Error message:', (supabaseError as any)?.message);
      console.log('💡 Check your network and CORS settings');
      return getDummyProjects();
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return getDummyProjects();
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    if (!supabase) {
      console.warn('Supabase not configured. Using fallback data.');
      return null;
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data ? {
      id: data.id,
      userId: data.user_id,
      title: data.name, // Changed from title to name
      description: data.description,
      status: data.status as Project['status'],
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    } : null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function createProject(project: Pick<Project, "title" | "description">): Promise<Project | null> {
  try {
    if (!supabase) {
      console.warn('Supabase not configured. Cannot create project.');
      return null;
    }

    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error('❌ No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: project.title,
        description: project.description,
        status: 'ongoing',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return null;
    }

    return data ? {
      id: data.id,
      userId: data.user_id,
      title: data.name,
      description: data.description,
      status: data.status as Project['status'],
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    } : null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// Project Items (Resources)
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    console.log('🗑️ Attempting to delete project:', projectId);
    
    if (!supabase) {
      console.error('❌ Supabase client is not available');
      return false;
    }

    // First, delete all resources associated with this project
    const { error: resourcesError } = await supabase
      .from('resources')
      .delete()
      .eq('project_id', projectId);

    if (resourcesError) {
      console.error('❌ Error deleting project resources:', resourcesError);
      return false;
    }

    // Then delete the project itself
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (projectError) {
      console.error('❌ Error deleting project:', projectError);
      return false;
    }

    console.log('✅ Successfully deleted project and its resources');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error deleting project:', error);
    return false;
  }
}

export async function deleteProjectItem(itemId: string): Promise<boolean> {
  try {
    console.log('🗑️ Attempting to delete project item:', itemId);
    
    if (!supabase) {
      console.error('❌ Supabase client is not available');
      return false;
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('❌ Error deleting project item:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      return false;
    }

    console.log('✅ Successfully deleted project item');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error deleting project item:', error);
    return false;
  }
}

export async function getItemsByProject(projectId: string): Promise<ProjectItem[]> {
  try {
    console.log('🔄 Fetching project items from database for project:', projectId);
    
    if (!supabase) {
      console.warn('Supabase not configured. Using fallback data.');
      return [];
    }

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching project items:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      return [];
    }

    console.log('✅ Successfully fetched project items:', data?.length, 'items');

    return data?.map((item: any) => ({
      id: item.id,
      projectId: item.project_id,
      platform: item.platform,
      username: item.is_link ? undefined : item.value,
      email: undefined,
      link: item.is_link ? item.value : undefined,
      notes: item.label,
      createdAt: item.created_at,
    })) || [];
    
  } catch (error) {
    console.error('❌ Error getting project items:', error);
    return [];
  }
}

export async function createProjectItem(item: Omit<ProjectItem, "id" | "createdAt">): Promise<ProjectItem | null> {
  try {
    console.log('🔄 Creating project item in database:', item);
    
    if (!supabase) {
      console.warn('Supabase not configured. Cannot create project item.');
      return null;
    }

    const { data, error } = await supabase
      .from('resources')
      .insert({
        project_id: item.projectId,
        platform: item.platform,
        label: item.notes || item.link || item.username,
        value: item.link || item.username || '',
        is_link: !!item.link,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating project item:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      return null;
    }

    console.log('✅ Successfully created project item');

    return data ? {
      id: data.id,
      projectId: data.project_id,
      platform: data.platform,
      username: data.is_link ? undefined : data.value,
      email: undefined,
      link: data.is_link ? data.value : undefined,
      notes: data.label,
      createdAt: data.created_at,
    } : null;
    
  } catch (error) {
    console.error('❌ Error creating project item:', error);
    return null;
  }
}

export async function updateProjectItem(
  itemId: string, 
  updates: Partial<Pick<ProjectItem, "platform" | "link" | "notes" | "username">>
): Promise<ProjectItem | null> {
  try {
    console.log('🔄 Updating project item in database:', itemId, updates);
    
    if (!supabase) {
      console.warn('Supabase not configured. Cannot update project item.');
      return null;
    }

    const { data, error } = await supabase
      .from('resources')
      .update({
        platform: updates.platform,
        label: updates.notes || updates.link || updates.username,
        value: updates.link || updates.username || '',
        is_link: !!updates.link,
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating project item:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      return null;
    }

    console.log('✅ Successfully updated project item');

    return data ? {
      id: data.id,
      projectId: data.project_id,
      platform: data.platform,
      username: data.is_link ? undefined : data.value,
      email: undefined,
      link: data.is_link ? data.value : undefined,
      notes: data.label,
      createdAt: data.created_at,
    } : null;
    
  } catch (error) {
    console.error('❌ Error updating project item:', error);
    return null;
  }
}

export async function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, "title" | "description" | "status">>
): Promise<Project | null> {
  try {
    console.log('🔄 Updating project in database:', projectId, updates);
    
    if (!supabase) {
      console.warn('Supabase not configured. Cannot update project.');
      return null;
    }

    const updateData: Record<string, unknown> = {};
    if (updates.title) updateData.name = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status) updateData.status = updates.status;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating project:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      return null;
    }

    console.log('✅ Successfully updated project');

    return data ? {
      id: data.id,
      userId: data.user_id,
      title: data.name,
      description: data.description,
      status: data.status as Project['status'],
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    } : null;
    
  } catch (error) {
    console.error('❌ Error updating project:', error);
    return null;
  }
}
