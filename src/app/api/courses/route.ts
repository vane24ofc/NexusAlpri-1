
// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';
import type { Course } from '@/types';
import { MOCK_COURSES as initialCoursesData } from '@/lib/constants';

// In-memory store for courses, initialized with mock data
// In a real application, this would interact with a database (e.g., MySQL as per user's preference)
let coursesDB: Course[] = JSON.parse(JSON.stringify(initialCoursesData)); // Deep copy

export async function GET() {
  try {
    // Simulate fetching from a database
    // When MySQL is ready, this part will call the user's MySQL access functions
    const coursesList: Course[] = [...coursesDB]; 

    return NextResponse.json(coursesList);
  } catch (error) {
    console.error("Error fetching courses from in-memory store:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: "Failed to fetch courses", error: errorMessage }, { status: 500 });
  }
}

// We will add POST, PUT, DELETE handlers in subsequent steps.
// These will interact with the in-memory coursesDB for now, 
// and later can be adapted to call MySQL functions.

