import { createClient } from '../../../types/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch projects with their resources
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`*, resources (*)`)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Projects fetch error:', projectsError)
      return NextResponse.json(
        { error: projectsError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      projects: projects || []
    })

  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
