/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Tăng giới hạn lên 50MB để thoải mái upload ảnh
    },
  },
  // Nếu bạn có config images thì giữ nguyên, chỉ thêm đoạn experimental bên trên
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;