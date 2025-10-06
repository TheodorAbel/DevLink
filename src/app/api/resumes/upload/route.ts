import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// POST /api/resumes/upload
// Multipart FormData: { file: File }
// Uses service role to upload to Storage, avoiding client-side RLS issues.
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1] || ''
    const userClient = createSupabaseServerClient(token)

    const { data: userRes, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = userRes.user.id

    const form = await req.formData().catch(() => null)
    if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF resumes are allowed' }, { status: 400 })
    }

    const ts = Date.now()
    const originalName = sanitizeFilename(file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`)
    const objectName = `${ts}_${userId}_${originalName}`

    const { error: upErr } = await supabaseAdmin.storage
      .from('resumes')
      .upload(objectName, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: 'application/pdf',
      })

    if (upErr) {
      return NextResponse.json({ error: upErr.message || 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({ objectName, originalName, size: file.size }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]/g, '_')
}
