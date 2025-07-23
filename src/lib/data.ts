
import type { User, Post } from './types';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, query, where, orderBy, limit } from 'firebase/firestore';

// In a real app, you would fetch this from a database.
// We are mapping Firebase UIDs to our mock users.
const fuidToId: Record<string, string> = {
    "c8aH423j2eM9n7oP1qR5tU6wXvY3": "1", // aliciakeys
    "a1bH456j2eM9n7oP1qR5tU6wXvY4": "2", // bencarter
    "z9yH456j2eM9n7oP1qR5tU6wXvY5": "3", // chloedavis
};


let users: User[] = [
  {
    id: '1',
    fuid: 'c8aH423j2eM9n7oP1qR5tU6wXvY3',
    name: 'Alicia Keys',
    username: 'aliciakeys',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Software Engineer & Tech Blogger. Exploring the latest in web development and open source.',
  },
  {
    id: '2',
    fuid: 'a1bH456j2eM9n7oP1qR5tU6wXvY4',
    name: 'Ben Carter',
    username: 'bencarter',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'UX Designer with a passion for creating beautiful and intuitive user experiences.',
  },
  {
    id: '3',
    fuid: 'z9yH456j2eM9n7oP1qR5tU6wXvY5',
    name: 'Chloe Davis',
    username: 'chloedavis',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Startup founder and business strategist. Sharing insights on entrepreneurship and productivity.',
  },
];

const initialPosts: Post[] = [
  {
    id: '1',
    slug: 'mastering-typescript-for-modern-web-development',
    title: 'Mastering TypeScript for Modern Web Development',
    content: `
TypeScript has become an essential tool for modern web developers. Its static typing capabilities help catch errors early, improve code quality, and make large-scale applications more maintainable. In this post, we'll dive deep into some advanced TypeScript features.

We will cover:
- Generic Constraints
- Conditional Types
- Mapped Types
- Decorators

By the end of this article, you'll have a solid understanding of how to leverage these features to write more robust and flexible code. Let's get started!
    `,
    authorId: '1',
    category: 'Technology',
    tags: ['TypeScript', 'WebDev', 'Programming', 'JavaScript'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: '2024-05-15T10:00:00Z',
    likes: 128,
    isBookmarked: false,
  },
  {
    id: '2',
    slug: 'the-art-of-minimalist-design',
    title: 'The Art of Minimalist Design',
    content: `
Minimalism in design is not just about what you remove, but about the intention behind what you keep. It's a philosophy that prioritizes clarity, function, and simplicity.

Key principles of minimalist design include:
- Ample white space
- Limited color palettes
- Strong typography
- Focus on content

This post explores how to apply these principles to create user interfaces that are not only visually appealing but also highly effective and user-friendly.
    `,
    authorId: '2',
    category: 'Creative',
    tags: ['Design', 'UX', 'Minimalism', 'UI'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: '2024-05-12T14:30:00Z',
    likes: 256,
    isBookmarked: true,
  },
  {
    id: '3',
    slug: '10-strategies-for-scaling-your-startup',
    title: '10 Strategies for Scaling Your Startup',
    content: `
Scaling a startup is one of the most challenging phases for any founder. It requires a shift in mindset from building a product to building a company.

Here are 10 proven strategies:
1.  Automate everything possible.
2.  Focus on hiring the right talent.
3.  Build a strong company culture.
4.  Listen to your customers.
5.  ...and more.

We'll break down each strategy with actionable advice and real-world examples to help you navigate the complexities of growth.
    `,
    authorId: '3',
    category: 'Business',
    tags: ['Startups', 'Entrepreneurship', 'Growth', 'Business'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: '2024-05-10T09:00:00Z',
    likes: 98,
    isBookmarked: false,
  },
   {
    id: '4',
    slug: 'a-guide-to-a-healthy-work-life-balance',
    title: 'A Guide to a Healthy Work-Life Balance',
    content: `
In today's fast-paced world, achieving a healthy work-life balance can seem impossible. However, it's crucial for long-term well-being and productivity.

This guide offers practical tips:
- Set clear boundaries between work and personal time.
- Prioritize self-care activities.
- Learn to say "no".
- Unplug regularly.

Implementing these small changes can have a significant impact on your overall quality of life. Let's explore how to create a more sustainable and fulfilling lifestyle.
    `,
    authorId: '1',
    category: 'Lifestyle',
    tags: ['Wellness', 'Productivity', 'Mental Health'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: '2024-05-08T18:00:00Z',
    likes: 150,
    isBookmarked: true,
  },
  {
    id: '5',
    slug: 'the-future-of-frontend-trends-to-watch-in-2025',
    title: 'The Future of Frontend: Trends to Watch in 2025',
    content: `
The frontend landscape is constantly evolving. As we look towards 2025, several key trends are emerging that will shape the future of web development.

What to watch:
- The rise of AI-powered development tools.
- Increased adoption of WebAssembly.
- The evolution of CSS with features like container queries.
- A continued focus on performance and accessibility.

This article provides a comprehensive overview of these trends and what they mean for developers.
    `,
    authorId: '2',
    category: 'Technology',
    tags: ['Frontend', 'WebDev', 'Trends', 'CSS', 'AI'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: '2024-05-05T11:45:00Z',
    likes: 312,
    isBookmarked: false,
  },
  {
    id: '6',
    slug: 'how-to-build-a-powerful-personal-brand',
    title: 'How to Build a Powerful Personal Brand',
    content: `
A strong personal brand is a valuable asset in any career. It's about showcasing your unique skills and personality to create opportunities.

Building your brand involves:
- Defining your niche and audience.
- Creating valuable content consistently.
- Engaging with your community.
- Being authentic.

This post will walk you through the steps to build a personal brand that resonates and opens doors.
    `,
    authorId: '3',
    category: 'Business',
    tags: ['Branding', 'Career', 'Marketing', 'Networking'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: '2024-05-01T16:20:00Z',
    likes: 75,
    isBookmarked: false,
  },
];

async function seedInitialData() {
    const postsCollection = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsCollection);
    if (postsSnapshot.empty) {
        console.log("Seeding initial posts...");
        for (const post of initialPosts) {
            const postRef = doc(db, 'posts', post.id);
            await setDoc(postRef, post);
        }
    }
}

// Call this once, maybe in a layout or app entry point if it were a real app with proper architecture.
// For now, we'll just let it be called on module load.
seedInitialData();

export function createNewUser(userData: { fuid: string; username: string; email: string; }) {
    if (doesUsernameExist(userData.username)) {
      console.warn("Username already exists. Cannot create new user.");
      return null;
    }
    const newUser: User = {
        id: `${users.length + 1}`,
        fuid: userData.fuid,
        name: userData.username, // Default name to username
        username: userData.username,
        avatarUrl: 'https://placehold.co/100x100.png',
        bio: 'This is a new PenLoft author!',
    };
    users.push(newUser);
    fuidToId[userData.fuid] = newUser.id;
    return newUser;
}

export async function createPost(postData: { title: string; content: string; category: string; tags: string[]; authorId: string; }) {
    const { title, content, category, tags, authorId } = postData;
    const author = users.find(u => u.fuid === authorId);

    if (!author) {
        console.error("Author not found. Cannot create post.");
        return null;
    }

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    const newPostRef = doc(collection(db, 'posts'));

    const newPost: Post = {
        id: newPostRef.id,
        slug: generateSlug(title) + '-' + newPostRef.id.slice(0, 5),
        title: title,
        content: content,
        authorId: author.id,
        category: category,
        tags: tags,
        imageUrl: `https://placehold.co/600x400.png`,
        createdAt: new Date().toISOString(),
        likes: 0,
        isBookmarked: false
    };

    await setDoc(newPostRef, newPost);
    return newPost;
}

export function getUsers() {
  return users;
}

export function getUser(id: string) {
  return users.find((user) => user.id === id);
}

export function getUserByUsername(username: string) {
  if (!username) return undefined;
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
}

export function getUserByFuid(fuid: string, email?: string | null) {
  const existingUser = users.find(u => u.fuid === fuid);
  if (existingUser) {
    return existingUser;
  }
  
  const newUsername = email ? email.split('@')[0] : `user${Math.floor(Math.random() * 10000)}`;
  const userByUsername = getUserByUsername(newUsername);
  const finalUsername = userByUsername ? `${newUsername}${Math.floor(Math.random() * 10000)}` : newUsername;
  
  return createNewUser({
    fuid: fuid,
    username: finalUsername,
    email: email || `${finalUsername}@example.com`,
  });
}


export function doesUsernameExist(username: string) {
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

export async function getPosts(): Promise<Post[]> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  const postsSnapshot = await getDocs(q);
  const postsList = postsSnapshot.docs.map(doc => doc.data() as Post);
  return postsList;
}

export async function getPost(id: string): Promise<Post | null> {
  const postRef = doc(db, 'posts', id);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
      return postSnap.data() as Post;
  }
  return null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, where('slug', '==', slug), limit(1));
  const postsSnapshot = await getDocs(q);
  if (!postsSnapshot.empty) {
      return postsSnapshot.docs[0].data() as Post;
  }
  return null;
}

export async function getPostsByUser(userId: string): Promise<Post[]> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, where('authorId', '==', userId), orderBy('createdAt', 'desc'));
  const postsSnapshot = await getDocs(q);
  const postsList = postsSnapshot.docs.map(doc => doc.data() as Post);
  return postsList;
}
