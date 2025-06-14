// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';
import type { Course } from '@/types';
// For now, we'll use an in-memory store derived from constants.
// In a real app, this would come from a database.
import { MOCK_COURSES as initialCoursesData } from '@/lib/constants';

// Simulate a database with an in-memory array
let coursesDB: Course[] = JSON.parse(JSON.stringify(initialCoursesData)); // Deep copy to avoid modifying constants

export async function GET() {
  // Simulate some network delay if needed
  // await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(coursesDB);
}

// We will add POST, PUT, DELETE handlers in subsequent steps.
// For example, to handle creating a new course:
// export async function POST(request: Request) {
//   try {
//     const newCourseData: Omit<Course, 'id'> = await request.json();
//     const newCourse: Course = {
//       ...newCourseData,
//       id: `crs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
//       modules: newCourseData.modules || [], // Ensure modules is an array
//     };
//     coursesDB.unshift(newCourse); // Add to the beginning of the array
//     return NextResponse.json(newCourse, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create course:", error);
//     return NextResponse.json({ message: "Error creating course", error: (error as Error).message }, { status: 500 });
//   }
// }
