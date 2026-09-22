import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { VALIDATION_RULES, sanitizeHtml } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!VALIDATION_RULES.EMAIL.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate name format
    if (!VALIDATION_RULES.NAME.test(name)) {
      return NextResponse.json(
        { error: 'Invalid name format' },
        { status: 400 }
      )
    }

    // Validate phone if provided
    if (phone && !VALIDATION_RULES.PHONE.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      )
    }

    // Validate company if provided
    if (company && !VALIDATION_RULES.COMPANY.test(company)) {
      return NextResponse.json(
        { error: 'Invalid company format' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 100 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Field length exceeds maximum allowed' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeHtml(name),
      email: sanitizeHtml(email),
      phone: phone ? sanitizeHtml(phone) : null,
      company: company ? sanitizeHtml(company) : null,
      subject: sanitizeHtml(subject),
      message: sanitizeHtml(message),
    }

    // Create contact entry
    const docRef = await adminDb.collection('contacts').add({
      ...sanitizedData,
      status: 'NEW',
      source: 'website',
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: docRef.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}