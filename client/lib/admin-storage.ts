// Utility functions for admin data persistence using localStorage

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface HeroData {
  title: string;
  rating: number;
  reviewCount: number;
  salePrice: number;
  deliveryDate: string;
  stockText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  productImages: string[];
}

export interface FeatureData {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

export interface TrustData {
  sellerRating: number;
  sellerReviewCount: number;
  returnsDays: number;
  returnsText: string;
}

export interface GalleryData {
  title: string;
  images: Array<{
    url: string;
    title: string;
    description: string;
  }>;
}

export interface PopupData {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image?: string;
  type: 'button-triggered' | 'exit-intent';
}

export interface AdminData {
  seo: SeoData;
  hero: HeroData;
  features: FeatureData[];
  trust: TrustData;
  gallery: GalleryData;
  popups: PopupData[];
  lastUpdated: string;
}

// Default data matching current hardcoded values
export const defaultAdminData: AdminData = {
  seo: {
    metaTitle: "Nutritious Snack Box with Breakfast Bars and Delicious Chips | Gift A Snack (42 Count)",
    metaDescription: "Get your 42-count nutritious snack box with breakfast bars and delicious chips. Perfect for all ages with beautiful packaging and greeting card included.",
    metaKeywords: "snack box, breakfast bars, healthy snacks, gift snacks, 42 count, nutritious"
  },
  hero: {
    title: "Nutritious Snack Box with Breakfast Bars and Delicious Chips | Gift A Snack (42 Count)",
    rating: 4.6,
    reviewCount: 23,
    salePrice: 31.95,
    deliveryDate: "Thu, Aug 21",
    stockText: "⚡ Limited stock available",
    primaryButtonText: "View Product Details",
    secondaryButtonText: "Learn More About This Product",
    productImages: [
      "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F05b5599b733643de9ed02db80950feb9?format=webp&width=800",
      "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2Fec2c685b6b9d438f97083ea2cdb4458b?format=webp&width=800"
    ]
  },
  features: [
    {
      id: "1",
      icon: "Package",
      title: "Variety of Snacks",
      description: "Perfect mix of breakfast bars and savory snacks for any time of day",
      color: "blue",
      image: "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F4d9abe9f679440fcb3470285697707f4?format=webp&width=800"
    },
    {
      id: "2",
      icon: "Gift",
      title: "High-End Packaging",
      description: "Attractive and professional packaging that makes a great impression",
      color: "purple",
      image: "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F6305c43f8b6449fc8926c50b002e25fe?format=webp&width=800"
    },
    {
      id: "3",
      icon: "Zap",
      title: "Grab-and-Go Convenience",
      description: "Individually packaged snacks perfect for busy lifestyles",
      color: "green",
      image: "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F26b950db7e9644baa7113c5a0046d0fa?format=webp&width=800"
    },
    {
      id: "4",
      icon: "Users",
      title: "Suitable for All Ages",
      description: "Perfect for adults, teens, and college students alike",
      color: "orange",
      image: "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2Fa7c068e933744309b8f41ed0726156a2?format=webp&width=800"
    },
    {
      id: "5",
      icon: "Heart",
      title: "Heartwarming Greeting Card",
      description: "Comes with a special greeting card to show you care",
      color: "red",
      image: "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F19d8d6717d2a4dc6b633c9494573527a?format=webp&width=800"
    },
    {
      id: "6",
      icon: "BadgeCheck",
      title: "42 Count Value",
      description: "Generous quantity ensuring lasting satisfaction and value",
      color: "indigo",
      image: "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F74bff8b15ba640b1acf1428f6b9b71b9?format=webp&width=800"
    }
  ],
  trust: {
    sellerRating: 4.1,
    sellerReviewCount: 570,
    returnsDays: 90,
    returnsText: "Shop with confidence - easy returns"
  },
  gallery: {
    title: "See What's Inside Your Box",
    images: [
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800",
        title: "Complete Collection",
        description: "Full view of all 42 snacks"
      },
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F05b5599b733643de9ed02db80950feb9?format=webp&width=800",
        title: "Inside View",
        description: "Contents of the snack box"
      },
      {
        url: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2Fec2c685b6b9d438f97083ea2cdb4458b?format=webp&width=800",
        title: "Beautiful Packaging",
        description: "Premium box presentation"
      }
    ]
  },
  popups: [
    {
      id: "button-popup",
      title: "Special Offer!",
      description: "Get 10% off your first order when you subscribe to our newsletter.",
      buttonText: "Get My Discount",
      buttonLink: "mailto:subscribe@example.com?subject=Newsletter%20Subscription",
      image: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=400",
      type: "button-triggered"
    },
    {
      id: "exit-popup",
      title: "Wait! Don't Miss Out!",
      description: "Join our newsletter for exclusive snack deals and new product alerts.",
      buttonText: "Subscribe Now",
      buttonLink: "mailto:newsletter@example.com?subject=Subscribe",
      image: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F05b5599b733643de9ed02db80950feb9?format=webp&width=400",
      type: "exit-intent"
    }
  ],
  lastUpdated: new Date().toISOString()
};

// Storage key
const ADMIN_DATA_KEY = 'snackbox_admin_data';

// Get admin data from localStorage
export function getAdminData(): AdminData {
  try {
    const stored = localStorage.getItem(ADMIN_DATA_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultAdminData,
        ...parsed,
        seo: { ...defaultAdminData.seo, ...parsed.seo },
        hero: { ...defaultAdminData.hero, ...parsed.hero },
        trust: { ...defaultAdminData.trust, ...parsed.trust },
        gallery: { ...defaultAdminData.gallery, ...parsed.gallery }
      };
    }
  } catch (error) {
    console.error('Error loading admin data:', error);
  }
  return defaultAdminData;
}

// Save admin data to localStorage
export function saveAdminData(data: Partial<AdminData>): void {
  try {
    const current = getAdminData();
    const updated = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving admin data:', error);
    throw new Error('Failed to save data');
  }
}

// Save specific section
export function saveSection<K extends keyof AdminData>(
  section: K, 
  data: AdminData[K]
): void {
  saveAdminData({ [section]: data } as Partial<AdminData>);
}

// Reset to defaults
export function resetAdminData(): void {
  localStorage.removeItem(ADMIN_DATA_KEY);
}

// Check if data exists
export function hasAdminData(): boolean {
  return localStorage.getItem(ADMIN_DATA_KEY) !== null;
}
