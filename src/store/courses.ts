
'use client';

import { atom } from 'jotai';
import type { Course } from '@/types';
import { MOCK_COURSES as initialMockCourses } from '@/lib/constants';

// Atom to hold the initial mock courses, can be used for reset or reference
export const initialCoursesReferenceAtom = atom<Course[]>(initialMockCourses);

// The main atom for the dynamic list of courses, initialized with mock data
export const coursesAtom = atom<Course[]>(initialMockCourses);

// Atom derived to get the count of courses
export const courseCountAtom = atom((get) => get(coursesAtom).length);

// Interface for the data expected when adding a new course
interface NewCourseInput {
  courseTitle: string;
  courseDescription: string;
  courseCategory: string;
  instructorName: string; // Name of the instructor
  courseThumbnail?: File | string | null; // Can be a File object, a data URL string, or null/undefined
  dataAiHint?: string;
}

// Write-only atom to add a new course
export const addCourseAtom = atom(
  null, // First argument is for read, null means write-only
  async (get, set, newCourseData: NewCourseInput) => { // Getter, Setter, Argument. Made async for file reading.
    const existingCourses = get(coursesAtom);
    
    let thumbnailUrl = `https://placehold.co/350x197.png?text=${encodeURIComponent(newCourseData.courseTitle.substring(0,12))}`;
    let finalDataAiHint = newCourseData.dataAiHint || newCourseData.courseCategory.toLowerCase().replace(/\s+/g, '-').split('-').slice(0,2).join(' ') || "course abstract";

    if (newCourseData.courseThumbnail instanceof File) {
      try {
        thumbnailUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(newCourseData.courseThumbnail);
        });
      } catch (error) {
        console.error("Error reading file for thumbnail:", error);
        // Keep placeholder if file reading fails
      }
    } else if (typeof newCourseData.courseThumbnail === 'string' && newCourseData.courseThumbnail) {
      // If it's already a string (e.g., data URL from preview or an existing URL)
      thumbnailUrl = newCourseData.courseThumbnail;
    }

    const courseToAdd: Course = {
      id: `crs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newCourseData.courseTitle,
      description: newCourseData.courseDescription,
      category: newCourseData.courseCategory,
      instructor: newCourseData.instructorName,
      thumbnailUrl: thumbnailUrl,
      dataAiHint: finalDataAiHint,
      modules: [], // Initialize with empty modules
    };

    set(coursesAtom, [courseToAdd, ...existingCourses]);
    return courseToAdd; // Optionally return the added course
  }
);
