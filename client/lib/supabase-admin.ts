import { supabase } from "./supabase";
import type { AdminData } from "./admin-storage";

// Initialize Supabase database schema
export async function initializeSupabaseSetup(): Promise<boolean> {
  try {
    const response = await fetch("/api/supabase-setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Setup failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Supabase setup:", result.message);
    return result.success;
  } catch (error) {
    console.error("Failed to initialize Supabase:", error);
    return false;
  }
}

// Upload image to Supabase Storage
export async function uploadImage(
  file: File,
  path: string,
): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

// Delete image from Supabase Storage
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage.from("images").remove([fileName]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    return false;
  }
}

// Get admin data from Supabase
export async function getSupabaseAdminData(): Promise<AdminData | null> {
  try {
    const { data, error } = await supabase
      .from("admin_content")
      .select("*")
      .order("section");

    if (error) {
      console.error("Error fetching admin data:", error);
      return null;
    }

    // Reconstruct AdminData object from database rows
    const adminData: Partial<AdminData> = {};

    data?.forEach((row) => {
      adminData[row.section as keyof AdminData] = row.data;
    });

    return adminData as AdminData;
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    return null;
  }
}

// Save admin data to Supabase
export async function saveSupabaseAdminData(
  data: Partial<AdminData>,
): Promise<boolean> {
  try {
    // Save each section separately
    const promises = Object.entries(data).map(
      async ([section, sectionData]) => {
        if (section === "lastUpdated") return true; // Skip lastUpdated as it's handled automatically

        const { error } = await supabase.from("admin_content").upsert(
          {
            section,
            data: sectionData,
          },
          {
            onConflict: "section",
          },
        );

        if (error) {
          console.error(`Error saving ${section}:`, error);
          return false;
        }
        return true;
      },
    );

    const results = await Promise.all(promises);
    return results.every((result) => result === true);
  } catch (error) {
    console.error("Failed to save admin data:", error);
    return false;
  }
}

// Save specific section to Supabase
export async function saveSupabaseSection<K extends keyof AdminData>(
  section: K,
  data: AdminData[K],
): Promise<boolean> {
  try {
    const { error } = await supabase.from("admin_content").upsert(
      {
        section: section as string,
        data: data,
      },
      {
        onConflict: "section",
      },
    );

    if (error) {
      console.error(`Error saving section ${section}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Failed to save section ${section}:`, error);
    return false;
  }
}

// Migrate data from localStorage to Supabase
export async function migrateLocalStorageToSupabase(): Promise<boolean> {
  try {
    const localData = localStorage.getItem("snackbox_admin_data");
    if (!localData) {
      console.log("No localStorage data to migrate");
      return true;
    }

    const parsedData = JSON.parse(localData);
    const success = await saveSupabaseAdminData(parsedData);

    if (success) {
      console.log("Successfully migrated localStorage data to Supabase");
      // Optionally remove localStorage data after successful migration
      // localStorage.removeItem('snackbox_admin_data');
    }

    return success;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  }
}
