import { 
  getSupabaseAdminData, 
  saveSupabaseAdminData, 
  saveSupabaseSection,
  initializeSupabaseSetup,
  migrateLocalStorageToSupabase
} from './supabase-admin';

// Re-export types from the original admin-storage
export type {
  SeoData,
  HeroData,
  FeatureData,
  TrustData,
  GalleryData,
  ReviewData,
  ReviewsData,
  FinalCtaData,
  FooterData,
  PopupData,
  AdminData
} from './admin-storage';

import { defaultAdminData, type AdminData } from './admin-storage';

// Track initialization status
let isInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

// Initialize Supabase if not already done
async function ensureInitialized(): Promise<boolean> {
  if (isInitialized) return true;
  
  if (initializationPromise) {
    return await initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('Initializing Supabase...');
      const setupSuccess = await initializeSupabaseSetup();
      
      if (setupSuccess) {
        console.log('Supabase initialized successfully');
        // Try to migrate localStorage data
        await migrateLocalStorageToSupabase();
        isInitialized = true;
        return true;
      } else {
        console.error('Supabase initialization failed');
        return false;
      }
    } catch (error) {
      console.error('Supabase initialization error:', error);
      return false;
    }
  })();

  return await initializationPromise;
}

// Get admin data with fallback to localStorage
export async function getAdminData(): Promise<AdminData> {
  try {
    const initialized = await ensureInitialized();
    
    if (!initialized) {
      console.warn('Supabase not initialized, falling back to localStorage');
      return getLocalStorageData();
    }

    // Try to get data from Supabase
    const supabaseData = await getSupabaseAdminData();
    
    if (supabaseData) {
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultAdminData,
        ...supabaseData,
        seo: { ...defaultAdminData.seo, ...supabaseData.seo },
        hero: { ...defaultAdminData.hero, ...supabaseData.hero },
        featuresSection: { 
          ...defaultAdminData.featuresSection, 
          ...supabaseData.featuresSection,
          features: supabaseData.featuresSection?.features || defaultAdminData.featuresSection.features
        },
        trust: { ...defaultAdminData.trust, ...supabaseData.trust },
        gallery: { ...defaultAdminData.gallery, ...supabaseData.gallery },
        reviews: { 
          ...defaultAdminData.reviews, 
          ...supabaseData.reviews,
          reviews: supabaseData.reviews?.reviews || defaultAdminData.reviews.reviews
        },
        finalCta: { 
          ...defaultAdminData.finalCta, 
          ...supabaseData.finalCta,
          benefits: supabaseData.finalCta?.benefits || defaultAdminData.finalCta.benefits,
          trustBarItems: supabaseData.finalCta?.trustBarItems || defaultAdminData.finalCta.trustBarItems
        },
        footer: { 
          ...defaultAdminData.footer, 
          ...supabaseData.footer,
          socialLinks: supabaseData.footer?.socialLinks || defaultAdminData.footer.socialLinks
        },
        lastUpdated: supabaseData.lastUpdated || new Date().toISOString()
      };
    } else {
      // Fallback to localStorage if Supabase data not found
      console.log('No Supabase data found, using localStorage fallback');
      return getLocalStorageData();
    }
  } catch (error) {
    console.error('Error loading admin data from Supabase:', error);
    return getLocalStorageData();
  }
}

// Fallback to localStorage
function getLocalStorageData(): AdminData {
  try {
    const stored = localStorage.getItem('snackbox_admin_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultAdminData,
        ...parsed,
        seo: { ...defaultAdminData.seo, ...parsed.seo },
        hero: { ...defaultAdminData.hero, ...parsed.hero },
        featuresSection: { 
          ...defaultAdminData.featuresSection, 
          ...parsed.featuresSection
        },
        trust: { ...defaultAdminData.trust, ...parsed.trust },
        gallery: { ...defaultAdminData.gallery, ...parsed.gallery },
        reviews: { ...defaultAdminData.reviews, ...parsed.reviews },
        finalCta: { ...defaultAdminData.finalCta, ...parsed.finalCta },
        footer: { ...defaultAdminData.footer, ...parsed.footer }
      };
    }
  } catch (error) {
    console.error('Error loading admin data from localStorage:', error);
  }
  return defaultAdminData;
}

// Save admin data with fallback to localStorage
export async function saveAdminData(data: Partial<AdminData>): Promise<void> {
  try {
    const initialized = await ensureInitialized();
    
    if (!initialized) {
      console.warn('Supabase not initialized, saving to localStorage');
      saveToLocalStorage(data);
      return;
    }

    // Save to Supabase
    const success = await saveSupabaseAdminData(data);
    
    if (!success) {
      console.warn('Failed to save to Supabase, falling back to localStorage');
      saveToLocalStorage(data);
      throw new Error('Failed to save to Supabase');
    }

    console.log('Successfully saved data to Supabase');
  } catch (error) {
    console.error('Error saving admin data:', error);
    // Fallback to localStorage
    saveToLocalStorage(data);
    throw new Error('Failed to save data');
  }
}

// Save to localStorage as fallback
function saveToLocalStorage(data: Partial<AdminData>): void {
  try {
    const current = getLocalStorageData();
    const updated = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('snackbox_admin_data', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Save specific section
export async function saveSection<K extends keyof AdminData>(
  section: K, 
  data: AdminData[K]
): Promise<void> {
  try {
    const initialized = await ensureInitialized();
    
    if (!initialized) {
      console.warn('Supabase not initialized, saving to localStorage');
      saveToLocalStorage({ [section]: data } as Partial<AdminData>);
      return;
    }

    // Save to Supabase
    const success = await saveSupabaseSection(section, data);
    
    if (!success) {
      console.warn('Failed to save section to Supabase, falling back to localStorage');
      saveToLocalStorage({ [section]: data } as Partial<AdminData>);
      throw new Error('Failed to save section to Supabase');
    }

    console.log(`Successfully saved ${section} to Supabase`);
  } catch (error) {
    console.error(`Error saving section ${section}:`, error);
    // Fallback to localStorage
    saveToLocalStorage({ [section]: data } as Partial<AdminData>);
    throw new Error('Failed to save section');
  }
}

// Reset to defaults (for development)
export function resetAdminData(): void {
  localStorage.removeItem('snackbox_admin_data');
  // Note: This doesn't clear Supabase data - would need admin endpoint for that
}

// Check if data exists
export function hasAdminData(): boolean {
  return localStorage.getItem('snackbox_admin_data') !== null;
}

// Manual migration function (for development)
export async function migrateToBabase(): Promise<boolean> {
  return await migrateLocalStorageToSupabase();
}
