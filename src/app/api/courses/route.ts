
// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import type { Course } from '@/types';
import { MOCK_COURSES as initialCoursesData } from '@/lib/constants';

// In-memory store for courses, initialized with mock data
// This will be replaced by actual database calls later.
let coursesDB: Course[] = JSON.parse(JSON.stringify(initialCoursesData)); // Deep copy

export async function GET() {
  let connection;
  try {
    // Database connection details from environment variables
    // Ensure these are set in your .env.local file
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
    });

    // Perform a simple query to check the connection
    await connection.query('SELECT 1');

    // If connection is successful, you can proceed to fetch actual data
    // For now, we'll just return a success message and the mock data
    // Replace this with your actual query to fetch courses from MySQL later
    // Example: const [rows] = await connection.execute('SELECT * FROM courses');
    // const coursesList: Course[] = rows as Course[];

    const coursesList: Course[] = [...coursesDB]; // Using mock data for now after successful connection

    return NextResponse.json({
      dbConnectionStatus: 'Successfully connected to MySQL database!',
      courses: coursesList,
    });

  } catch (error: any) {
    console.error("Error connecting to MySQL or fetching courses:", error);
    // Determine if the error is a connection error or other
    let dbStatus = "Failed to connect to MySQL database.";
    if (error.code) { // MySQL errors often have a code (e.g., ER_ACCESS_DENIED_ERROR, ENOTFOUND)
        dbStatus = `MySQL Connection Error: ${error.message} (Code: ${error.code})`;
    } else {
        dbStatus = `Error: ${error.message}`;
    }
    
    // Return an error response but still provide mock courses for frontend functionality
    return NextResponse.json({
      dbConnectionStatus: dbStatus,
      courses: [...coursesDB], // Fallback to mock data for UI
      errorDetails: error.message, // Provide more error details if needed
    }, { status: 200 }); // Return 200 so the UI can still show mock data if DB fails

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
