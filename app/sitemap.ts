import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // In a real scenario, you might fetch blog posts or project IDs here if you had dynamic routes
  // For a single-page portfolio, we list the main sections as part of the root, or just the root.
  
  return [
    {
      url: 'https://tahamina-khatun.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // If you had separate pages like /blog, you would add them here
  ];
}
