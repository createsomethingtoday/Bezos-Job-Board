/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://bezosacademstg.wpengine.com/ https://bezosacademy.org/ https://bezos-academy-job-board.webflow.io/',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://bezosacademstg.wpengine.com/ https://bezosacademy.org/ https://bezos-academy-job-board.webflow.io/",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://bezosacademstg.wpengine.com/ https://bezosacademy.org/ https://bezos-academy-job-board.webflow.io/',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;