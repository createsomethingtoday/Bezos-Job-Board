/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*?)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'ALLOW-FROM https://bezosacademstg.wpengine.com/',
            },
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors 'self' https://bezosacademstg.wpengine.com/",
            },
            {
              key: 'Access-Control-Allow-Origin',
              value: 'https://bezosacademstg.wpengine.com/',
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  