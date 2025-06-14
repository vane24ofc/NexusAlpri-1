// src/store/courses.ts
'use client';

import { atom } from 'jotai';
import type { Course, Module } from '@/types';
import { z } from 'zod';

// Atom to hold courses fetched from the API
export const coursesAtom = atom<Course[]>([]);
// Atom to hold any error message during fetching
export const coursesErrorAtom = atom<string | null>(null);
// Atom to indicate if courses are currently being loaded
export const coursesLoadingAtom = atom<boolean>(true);

// Atom to trigger fetching courses from the API
export const loadCoursesAtom = atom(
  null, // This is a write-only atom for dispatching the fetch
  async (get, set) => {
    set(coursesLoadingAtom, true);
    set(coursesErrorAtom, null);
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText} (${response.status})`);
      }
      const data: Course[] = await response.json();
      set(coursesAtom, data);
    } catch (error) {
      console.error("Error loading courses:", error);
      set(coursesErrorAtom, (error as Error).message);
      set(coursesAtom, []); // Reset to empty on error
    } finally {
      set(coursesLoadingAtom, false);
    }
  }
);

// Atom derived to get the count of courses
export const courseCountAtom = atom((get) => get(coursesAtom).length);

// --- Atoms for Create, Update, Delete will be modified to use API calls in future steps ---

interface NewCourseInputStore {
  courseTitle: string;
  courseDescription: string;
  courseCategory: string;
  instructor: string;
  courseThumbnail?: File | string | null;
  dataAiHint?: string;
}

// This atom will be updated to POST to /api/courses
export const addCourseAtom = atom(
  null,
  async (get, set, newCourseData: NewCourseInputStore): Promise<Course> => {
    console.warn("addCourseAtom: API POST call not implemented yet. Simulating local add and refresh.");
    
    // Simulate what the backend might do for the thumbnail if it's a file
    // In a real scenario, the file is uploaded, backend returns a URL.
    let thumbnailUrl = `https://placehold.co/350x197.png?text=${encodeURIComponent(newCourseData.courseTitle.substring(0,12))}`;
    if (newCourseData.courseThumbnail instanceof File) {
      // This is a placeholder. Real file upload needs backend logic.
      thumbnailUrl = URL.createObjectURL(newCourseData.courseThumbnail); // Temporary client-side URL
    } else if (typeof newCourseData.courseThumbnail === 'string' && newCourseData.courseThumbnail) {
      thumbnailUrl = newCourseData.courseThumbnail;
    }
    
    const mockCourseForApi: Omit<Course, 'id' | 'modules'> & { modules?: Module[] } = {
      title: newCourseData.courseTitle,
      description: newCourseData.courseDescription,
      category: newCourseData.courseCategory,
      instructor: newCourseData.instructor,
      thumbnailUrl: thumbnailUrl,
      dataAiHint: newCourseData.dataAiHint || newCourseData.courseCategory.toLowerCase().replace(/\s+/g, '-').split('-').slice(0,2).join(' '),
      modules: [], // Start with empty modules
    };

    // When POST is implemented, this will be:
    // const response = await fetch('/api/courses', { method: 'POST', body: JSON.stringify(mockCourseForApi), headers: {'Content-Type': 'application/json'} });
    // const createdCourse = await response.json();
    // set(loadCoursesAtom); // Refresh list from backend
    // return createdCourse;

    // For now, to make UI work somewhat:
    alert("Course creation is simulated. Data will be re-fetched, overwriting this if not on backend.");
    set(loadCoursesAtom); // This will re-fetch, and since POST isn't real, the new course won't be there.
                         // This highlights the need for real POST.
    
    // Return a shape that matches Course, even if temporary
    return { 
      ...mockCourseForApi, 
      id: `sim-${Date.now()}`, 
      modules: mockCourseForApi.modules || [] 
    } as Course;
  }
);

export const updateCourseModulesAtom = atom(
  null,
  async (get, set, { courseId, modules }: { courseId: string; modules: Module[] }) => {
    console.warn("updateCourseModulesAtom: API PUT call not implemented yet.");
    // This will be an API call like PUT /api/courses/{courseId}
    // For now, simulate optimistic update and then refresh
    const currentCourses = get(coursesAtom);
    const updatedCourses = currentCourses.map(c => c.id === courseId ? {...c, modules} : c);
    set(coursesAtom, updatedCourses); // Optimistic update
    
    // In a real scenario:
    // await fetch(`/api/courses/${courseId}`, { method: 'PUT', body: JSON.stringify({ modules }), headers: {'Content-Type': 'application/json'} });
    // set(loadCoursesAtom); // Refresh to get authoritative state

    alert("Module update is simulated. Data will be re-fetched if API were live.");
    // set(loadCoursesAtom); // Simulating a refresh after potential PUT
  }
);

const lessonSchemaInternal = z.object({
  id: z.string(),
  title: z.string().min(3, "El título de la lección debe tener al menos 3 caracteres."),
  contentType: z.enum(['video', 'link', 'document']),
  contentUrl: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
});

const moduleSchemaInternal = z.object({
  id: z.string(),
  title: z.string().min(3, "El título del módulo debe tener al menos 3 caracteres."),
  lessons: z.array(lessonSchemaInternal),
});

export const courseFormValidationSchema = z.object({
  courseTitle: z.string().min(5, { message: "El título debe tener al menos 5 caracteres." }),
  courseDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  courseCategory: z.string().min(3, { message: "La categoría debe tener al menos 3 caracteres." }),
  instructorName: z.string().min(3, { message: "El nombre del instructor debe tener al menos 3 caracteres." }).optional(),
  courseThumbnail: z.any().optional(),
  modules: z.array(moduleSchemaInternal),
});
export type CourseFormValuesForEdit = z.infer<typeof courseFormValidationSchema>;

export const saveFullCourseEditAtom = atom(
  null,
  async (get, set, { courseId, values }: { courseId: string; values: CourseFormValuesForEdit }) => {
    console.warn("saveFullCourseEditAtom: API PUT call not implemented yet.");
    
    let processedThumbnailUrl = values.courseThumbnail;
    if (values.courseThumbnail instanceof File) {
      // Placeholder: Real file upload would happen here, then use returned URL.
      // For now, if it's a File, we'll assume it's a new upload that can't be persisted to mock backend.
      // A real backend would handle this and return a storable URL.
      console.log("Thumbnail is a file, needs backend upload handling.");
      // For optimistic UI, use a temporary URL or a placeholder.
      processedThumbnailUrl = URL.createObjectURL(values.courseThumbnail); // Temporary client-side URL for display
    } else if (typeof values.courseThumbnail === 'string') {
      // It's an existing URL or a data URL.
      processedThumbnailUrl = values.courseThumbnail;
    } else {
      processedThumbnailUrl = `https://placehold.co/350x197.png?text=${encodeURIComponent(values.courseTitle.substring(0,12))}`;
    }

    const courseUpdatePayload = {
      title: values.courseTitle,
      description: values.courseDescription,
      category: values.courseCategory,
      instructor: values.instructorName, // This should come from the form
      thumbnailUrl: processedThumbnailUrl, // This would be the URL from backend after upload
      dataAiHint: values.courseCategory.toLowerCase().replace(/\s+/g, '-').split('-').slice(0,2).join(' ') || "course abstract",
      modules: values.modules,
    };

    // In a real scenario:
    // const response = await fetch(`/api/courses/${courseId}`, { method: 'PUT', body: JSON.stringify(courseUpdatePayload), headers: {'Content-Type': 'application/json'} });
    // const updatedCourseFromApi = await response.json();
    // set(loadCoursesAtom); // Refresh list from backend
    // return updatedCourseFromApi;

    // For now, simulate optimistic update:
    const currentCourses = get(coursesAtom);
    const updatedCourses = currentCourses.map(c => 
      c.id === courseId ? { ...c, ...courseUpdatePayload, id: c.id } : c // Ensure ID is preserved
    );
    set(coursesAtom, updatedCourses);
    alert("Course edit is simulated. Data will be re-fetched if API were live.");
    // set(loadCoursesAtom);

    return updatedCourses.find(c => c.id === courseId) as Course;
  }
);
