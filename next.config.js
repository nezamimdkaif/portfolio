/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce static HTML export only for production builds (GitHub Pages deployment)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  // Disable image optimization since static hosting does not run a Node server for image optimization resizing
  images: {
    unoptimized: true,
  },

  // NOTE: If your site is hosted on a GitHub Pages repository sub-path (e.g. username.github.io/portfolio),
  // uncomment the line below and set it to your repository name:
  basePath: '/portfolio',

  // Expose the base path to the client-side code
  env: {
    NEXT_PUBLIC_BASE_PATH: '/portfolio',
  },
}

module.exports = nextConfig
