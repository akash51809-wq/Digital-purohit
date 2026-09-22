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

async function testPublicAPI() {
  try {
    console.log('Testing public API logic...\n');
    
    const snapshot = await db.collection('posts').get();
    
    const allPosts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        image: data.image,
        author: data.author,
        readTime: data.readTime,
        tags: data.tags,
        isPublished: data.isPublished,
        createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
      };
    });
    
    console.log(`Total posts: ${allPosts.length}`);
    console.log(`Published check for first post:`, allPosts[0]?.isPublished, typeof allPosts[0]?.isPublished);
    
    const posts = allPosts
      .filter(post => post.isPublished === true || post.isPublished === 'true')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`Filtered published posts: ${posts.length}\n`);
    
    if (posts.length > 0) {
      console.log('First 3 posts:');
      posts.slice(0, 3).forEach(post => {
        console.log(`- ${post.title}`);
        console.log(`  Published: ${post.isPublished}`);
        console.log(`  Has image: ${!!post.image}`);
        console.log(`  Has excerpt: ${!!post.excerpt}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testPublicAPI();
