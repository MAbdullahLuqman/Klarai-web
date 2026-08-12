/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],

  async headers() {
    return [
      {
        source: '/(.*)llms.txt',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/niche/seo-for-pest-control', destination: '/services/seo-services', permanent: true },
      { source: '/niche/seo-for-will-writers-uk', destination: '/services/seo-services', permanent: true },
      { source: '/niche/seo-for-custom-tuning-garages-uk', destination: '/industries/seo-for-garages', permanent: true },
      { source: '/niche/web-design-for-tuning-garages-uk', destination: '/industries/seo-for-garages', permanent: true },
      { source: '/niche/web-design-for-architects-uk', destination: '/services/web-development', permanent: true },
      { source: '/niche/seo-for-plumbers', destination: '/blog/seo-for-plumbers', permanent: true },
    ];
  },
};

export default nextConfig;
