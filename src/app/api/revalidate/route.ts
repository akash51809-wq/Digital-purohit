import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path, type = 'page' } = body

    if (path) {
      revalidatePath(path, type as 'page' | 'layout')
      return NextResponse.json({ revalidated: true, path, now: Date.now() })
    }

    // Revalidate all if no specific path
    const paths = ['/', '/blog', '/portfolio', '/services', '/about', '/contact', '/team']
    paths.forEach(p => revalidatePath(p))
    
    return NextResponse.json({ revalidated: true, paths, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: String(err) }, { status: 500 })
  }
}
