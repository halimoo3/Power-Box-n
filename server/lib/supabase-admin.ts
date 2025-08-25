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
  try {
    // Create the table using direct SQL
    const { error: tableError } = await supabaseAdmin
      .from('admin_content')
      .select('id')
      .limit(1);

    // If table doesn't exist, we'll get an error
    if (tableError && tableError.message.includes('relation "admin_content" does not exist')) {
      console.log('Creating admin_content table...');

      // Table needs to be created via SQL in Supabase dashboard or using migrations
      // For now, we'll try to check if it exists and report status
      return {
        success: false,
        message: 'Table admin_content needs to be created in Supabase dashboard. Please run this SQL:\n\nCREATE TABLE admin_content (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  section TEXT NOT NULL UNIQUE,\n  data JSONB NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n);\n\nALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Enable all for authenticated users" ON admin_content USING (true) WITH CHECK (true);'
      };
    }

    console.log('Database schema verified successfully');
    return { success: true };
  } catch (error) {
    console.error('Error checking database schema:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createStorageBucket() {
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      return { success: false, error: listError.message };
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'images');

    if (!bucketExists) {
      console.log('Creating images bucket...');
      const { error } = await supabaseAdmin.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Error creating storage bucket:', error);
        return { success: false, error: error.message };
      }

      console.log('Images bucket created successfully');
    } else {
      console.log('Images bucket already exists');
    }

    return { success: true };
  } catch (error) {
    console.error('Error in createStorageBucket:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
