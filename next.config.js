/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://bezosacademstg.wpengine.com/ https://bezosacademy.org/', 
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://bezosacademstg.wpengine.com/ https://bezosacademy.org/",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://bezosacademstg.wpengine.com/ https://bezosacademy.org/',
          },
        ],  
      },
    ];
  },
};

module.exports = nextConfig;
