/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allows images from your Supabase storage
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Allows the social media preview image
      },
    ],
  },
};

export default nextConfig;