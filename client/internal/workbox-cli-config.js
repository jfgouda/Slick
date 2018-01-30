module.exports = {
  "globDirectory": "dist\\",
  "globPatterns": [
    "**/*.{js,txt,png,xml,css,eot,svg,ttf,woff,woff2,ico,jpg,json,html}"
  ],
  "swDest": "dist/sw.js",
  "globIgnores": [
    "..\\workbox-cli-config.js"
  ],
  runtimeCaching: [{
    urlPattern: /\/api\/(.*)/,
    handler: 'staleWhileRevalidate',
    options: {
      cacheName: 'SoCo-Data',
      cacheableResponse: {
        statuses: [200]
      }
    }
  }],
  navigateFallback: '/offline.html',
  verbose: true
};
