
// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';
import type { Course } from '@/types';
import { db } from '@/lib/firebase'; // Import your Firestore instance
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Remove in-memory store if it exists
// import { MOCK_COURSES as initialCoursesData } from '@/lib/constants';
// let coursesDB: Course[] = JSON.parse(JSON.stringify(initialCoursesData));

export async function GET() {
  try {
    const coursesCollection = collection(db, 'courses');
    // Optionally, order by a field, e.g., title or a creation timestamp
    // const q = query(coursesCollection, orderBy("title")); 
    const coursesSnapshot = await getDocs(coursesCollection);
    
    const coursesList: Course[] = coursesSnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure modules and lessons are arrays, even if undefined in Firestore
      // Firestore typically doesn't store empty arrays unless explicitly set.
      // It's good practice to ensure your data structure matches the type.
      const modules = data.modules ? data.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons || [],
      })) : [];

      return {
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        instructor: data.instructor || '',
        category: data.category || '',
        thumbnailUrl: data.thumbnailUrl || '',
        dataAiHint: data.dataAiHint || '',
        modules: modules,
      } as Course;
    });

    return NextResponse.json(coursesList);
  } catch (error) {
    console.error("Error fetching courses from Firestore:", error);
    // It's good to check the type of error and provide more specific messages
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: "Failed to fetch courses", error: errorMessage }, { status: 500 });
  }
}

// We will add POST, PUT, DELETE handlers in subsequent steps.
// These will interact with Firestore.
