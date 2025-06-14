
'use client';

import { atom } from 'jotai';
import type { Course, Module, Lesson } from '@/types';
import { MOCK_COURSES as initialMockCourses } from '@/lib/constants';

// Atom to hold the initial mock courses, can be used for reset or reference
export const initialCoursesReferenceAtom = atom<Course[]>(initialMockCourses.map(course => ({...course, modules: course.modules || [] })));

// The main atom for the dynamic list of courses, initialized with mock data
export const coursesAtom = atom<Course[]>(initialMockCourses.map(course => ({...course, modules: course.modules || [] })));

// Atom derived to get the count of courses
export const courseCountAtom = atom((get) => get(coursesAtom).length);

// Interface for the data expected when adding a new course
interface NewCourseInput {
  courseTitle: string;
  courseDescription: string;
  courseCategory: string;
  instructor: string; // Name of the instructor
  courseThumbnail?: File | string | null; // Can be a File object, a data URL string, or null/undefined
  dataAiHint?: string;
}

// Write-only atom to add a new course
export const addCourseAtom = atom(
  null, 
  async (get, set, newCourseData: NewCourseInput): Promise<Course> => { 
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
      }
    } else if (typeof newCourseData.courseThumbnail === 'string' && newCourseData.courseThumbnail) {
      thumbnailUrl = newCourseData.courseThumbnail;
    }

    const courseToAdd: Course = {
      id: `crs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newCourseData.courseTitle,
      description: newCourseData.courseDescription,
      category: newCourseData.courseCategory,
      instructor: newCourseData.instructor,
      thumbnailUrl: thumbnailUrl,
      dataAiHint: finalDataAiHint,
      modules: [], 
    };

    set(coursesAtom, [courseToAdd, ...existingCourses]);
    return courseToAdd; 
  }
);

// Atom to update only the modules of an existing course (used in the create flow's second step)
export const updateCourseModulesAtom = atom(
  null,
  (get, set, { courseId, modules }: { courseId: string; modules: Module[] }) => {
    const allCourses = get(coursesAtom);
    const updatedCourses = allCourses.map(course =>
      course.id === courseId ? { ...course, modules } : course
    );
    set(coursesAtom, updatedCourses);
  }
);

// Zod schema for course form values (can be imported by pages)
// This is a generic schema, specific pages might adapt it (e.g. instructor doesn't set instructorName)
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
  instructorName: z.string().min(3, { message: "El nombre del instructor debe tener al menos 3 caracteres." }).optional(), // Optional for instructor flow
  courseThumbnail: z.any().optional(),
  modules: z.array(moduleSchemaInternal),
});
export type CourseFormValuesForEdit = z.infer<typeof courseFormValidationSchema>;


// Atom to save full edits to an existing course (used by the admin edit page)
export const saveFullCourseEditAtom = atom(
  null,
  async (get, set, { courseId, values }: { courseId: string; values: CourseFormValuesForEdit }) => {
    const courses = get(coursesAtom);
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
      console.error("Course not found for editing with ID:", courseId);
      throw new Error("Curso no encontrado para editar.");
    }
    const existingCourse = courses[courseIndex];

    let processedThumbnailUrl = existingCourse.thumbnailUrl; 

    if (values.courseThumbnail instanceof File) {
      try {
        processedThumbnailUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(values.courseThumbnail as File);
        });
      } catch (error) {
        console.error("Error reading file for thumbnail during edit:", error);
        // Keep existing or placeholder if error
         processedThumbnailUrl = `https://placehold.co/350x197.png?text=${encodeURIComponent(values.courseTitle.substring(0,12))}`;
      }
    } else if (typeof values.courseThumbnail === 'string' && values.courseThumbnail) {
      // If it's a string (potentially a data URL from preview, or an existing one not changed)
      processedThumbnailUrl = values.courseThumbnail;
    } else if (values.courseThumbnail === null || values.courseThumbnail === undefined) {
      // If explicitly cleared or never set and no new file, use placeholder
      processedThumbnailUrl = `https://placehold.co/350x197.png?text=${encodeURIComponent(values.courseTitle.substring(0,12))}`;
    }
    
    const updatedCourse: Course = {
      ...existingCourse,
      title: values.courseTitle,
      description: values.courseDescription,
      category: values.courseCategory,
      instructor: values.instructorName || existingCourse.instructor, // instructorName from admin form
      thumbnailUrl: processedThumbnailUrl,
      dataAiHint: values.courseCategory.toLowerCase().replace(/\s+/g, '-').split('-').slice(0,2).join(' ') || "course abstract",
      modules: values.modules.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(les => ({ ...les }))
      })),
    };

    const updatedCoursesList = [...courses];
    updatedCoursesList[courseIndex] = updatedCourse;
    set(coursesAtom, updatedCoursesList);
    return updatedCourse;
  }
);
