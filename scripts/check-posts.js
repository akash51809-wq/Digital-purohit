require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function checkPosts() {
  try {
    console.log('Checking posts in Firebase...\n');
    
    const snapshot = await db.collection('posts').get();
    
    if (snapshot.empty) {
      console.log('❌ No posts found in database');
      console.log('\nTo add posts:');
      console.log('1. Go to http://localhost:3001/admin/posts');
      console.log('2. Click "New Article"');
      console.log('3. Fill in the form and make sure "Published" is checked');
      return;
    }
    
    console.log(`Found ${snapshot.size} post(s):\n`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`📄 ${doc.id}`);
      console.log(`   Title: ${data.title}`);
      console.log(`   Published: ${data.isPublished ? '✅ Yes' : '❌ No'}`);
      console.log(`   Category: ${data.category || 'N/A'}`);
      console.log('');
    });
    
    const publishedCount = snapshot.docs.filter(doc => doc.data().isPublished === true).length;
    console.log(`\n${publishedCount} published post(s) will appear on /blog page`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkPosts();
