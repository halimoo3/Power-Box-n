import { RequestHandler } from "express";
import { createDatabaseSchema, createStorageBucket } from "../lib/supabase-admin";

export const handleSupabaseSetup: RequestHandler = async (req, res) => {
  try {
    console.log('Setting up Supabase database schema...');
    await createDatabaseSchema();
    console.log('Database schema created successfully');

    console.log('Setting up Supabase storage bucket...');
    await createStorageBucket();
    console.log('Storage bucket created successfully');

    res.json({ 
      success: true, 
      message: 'Supabase setup completed successfully' 
    });
  } catch (error) {
    console.error('Supabase setup error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
