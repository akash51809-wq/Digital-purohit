import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  try {
    // Revalidate all main paths
    revalidatePath('/', 'layout')
    revalidatePath('/blog')
    revalidatePath('/portfolio')
    revalidatePath('/services')
    revalidatePath('/about')
    revalidatePath('/contact')
    revalidatePath('/team')
    
    // Revalidate API routes
    revalidatePath('/api/posts/public')
    revalidatePath('/api/projects/public')
    revalidatePath('/api/services')
    revalidatePath('/api/team')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Cache clear error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear cache' 
    }, { status: 500 })
  }
}
