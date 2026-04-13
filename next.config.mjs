/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Target both the global and niche llms.txt files
        source: '/(.*)llms.txt', 
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex', // AI reads it, Google hides it from search results
          },
        ],
      },
    ];
  },
};

export default nextConfig;
