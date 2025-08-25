import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../client/lib/supabase';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for admin client');
}

// Admin client with service role key for server-side operations
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database migration and setup functions
export async function createDatabaseSchema() {
  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      -- Create admin_content table for storing all admin data
      CREATE TABLE IF NOT EXISTS admin_content (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        section TEXT NOT NULL UNIQUE,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_admin_content_updated_at 
        BEFORE UPDATE ON admin_content 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();

      -- Enable RLS
      ALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;

      -- Create policies (for now, allow all operations - in production you'd want proper auth)
      DROP POLICY IF EXISTS "Enable read access for all users" ON admin_content;
      DROP POLICY IF EXISTS "Enable insert for all users" ON admin_content;
      DROP POLICY IF EXISTS "Enable update for all users" ON admin_content;
      
      CREATE POLICY "Enable read access for all users" ON admin_content FOR SELECT USING (true);
      CREATE POLICY "Enable insert for all users" ON admin_content FOR INSERT WITH CHECK (true);
      CREATE POLICY "Enable update for all users" ON admin_content FOR UPDATE USING (true);
    `
  });

  if (error) {
    console.error('Error creating database schema:', error);
    throw error;
  }

  return { success: true };
}

export async function createStorageBucket() {
  // Check if bucket already exists
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === 'images');

  if (!bucketExists) {
    const { error } = await supabaseAdmin.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error('Error creating storage bucket:', error);
      throw error;
    }
  }

  // Set up storage policies
  const { error: policyError } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      -- Enable RLS on storage objects
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Public Access" ON storage.objects;
      DROP POLICY IF EXISTS "Admin can upload images" ON storage.objects;
      DROP POLICY IF EXISTS "Admin can update images" ON storage.objects;
      DROP POLICY IF EXISTS "Admin can delete images" ON storage.objects;

      -- Create policies for images bucket
      CREATE POLICY "Public Access" ON storage.objects
        FOR SELECT USING (bucket_id = 'images');

      CREATE POLICY "Admin can upload images" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'images');

      CREATE POLICY "Admin can update images" ON storage.objects
        FOR UPDATE USING (bucket_id = 'images');

      CREATE POLICY "Admin can delete images" ON storage.objects
        FOR DELETE USING (bucket_id = 'images');
    `
  });

  if (policyError) {
    console.error('Error setting up storage policies:', policyError);
    // Don't throw here as the bucket might still work
  }

  return { success: true };
}
