
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      // For development (localhost)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
        search: '',
      },
      // For production - add your domain here
      // {
      //   protocol: 'https',
      //   hostname: 'yourdomain.com',
      //   port: '',
      //   pathname: '/**',
      // }
    ]
  }
};

export default nextConfig;
