/** @type {import('next').NextConfig} */
const nextConfig = {
  // THIS IS THE FIX: Moved out of "experimental" for newer Next.js versions
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],

  // Your existing llms.txt rules stay exactly the same
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