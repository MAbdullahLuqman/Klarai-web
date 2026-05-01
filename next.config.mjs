/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. THIS IS THE NEW PART: Tells Next.js to ignore the massive Chromium binary during build
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  },

  // 2. THIS IS YOUR EXISTING PART: Keeps your llms.txt hidden from Google but readable by AI
  async headers() {
    return [
      {
        source: '/(.*)llms.txt', 
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex', 
          },
        ],
      },
    ];
  },
};

export default nextConfig;