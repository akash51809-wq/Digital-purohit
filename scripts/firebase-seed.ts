import { adminDb } from '../src/lib/firebase-admin'
import { hashPassword } from '../src/lib/auth'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function main() {
  console.log('🌱 Seeding Firebase...')

  // Create admin user
  const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123')
  await adminDb.collection('users').doc('admin').set({
    email: process.env.ADMIN_EMAIL || 'admin@veliora-techworks.com',
    password: adminPassword,
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: new Date(),
  })

  console.log('✅ Firebase seeded successfully!')
}

main().catch(console.error)