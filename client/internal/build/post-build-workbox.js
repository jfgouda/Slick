const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
const build = require("workbox-build");

const WorkboxPackageJS = path.join(__dirname + '/../node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js');
const WorkboxPackageMap = path.join(__dirname + '/../node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js.map');

const WorkboxRoutePackageJS = path.join(__dirname + '/../node_modules/workbox-routing/build/importScripts/workbox-routing.prod.v2.1.0.js');
const WorkboxRoutePackageMap = path.join(__dirname + '/../node_modules/workbox-routing/build/importScripts/workbox-routing.prod.v2.1.0.js.map');

const WorkboxBroadcastPackageJS = path.join(__dirname + '/../node_modules/workbox-broadcast-cache-update/build/importScripts/workbox-broadcast-cache-update.prod.v2.0.3.js');
const WorkboxBroadcastPackageMap = path.join(__dirname + '/../node_modules/workbox-broadcast-cache-update/build/importScripts/workbox-broadcast-cache-update.prod.v2.0.3.js.map');

const WorkboxSyncPackageJS = path.join(__dirname + '/../node_modules/workbox-background-sync/build/importScripts/workbox-background-sync.prod.v2.0.3.js');
const WorkboxSyncPackageMap = path.join(__dirname + '/../node_modules/workbox-background-sync/build/importScripts/workbox-background-sync.prod.v2.0.3.js.map');

const distPath = path.join(__dirname + '/../dist/');

console.log(colors.cyan('\nRunning post-build-workbox tasks'));
copyFile(WorkboxPackageJS, distPath, (res) => console.log(res));
copyFile(WorkboxPackageMap, distPath, (res) => console.log(res));

copyFile(WorkboxRoutePackageJS, distPath, (res) => console.log(res));
copyFile(WorkboxRoutePackageMap, distPath, (res) => console.log(res));

copyFile(WorkboxBroadcastPackageJS, distPath, (res) => console.log(res));
copyFile(WorkboxBroadcastPackageMap, distPath, (res) => console.log(res));

copyFile(WorkboxSyncPackageJS, distPath, (res) => console.log(res));
copyFile(WorkboxSyncPackageMap, distPath, (res) => console.log(res));

console.log(colors.green(`Workbox reference files copied to: ${colors.yellow(distPath)}`));

function copyFile(source, target, cb) {
  let cbCalled = false;
  let rd = fs.createReadStream(source);
  let fn = rd.path.split("\\").pop();
  let wr = fs.createWriteStream(target + fn);

  rd.on("error", (err) => done(err));
  wr.on("error", (err) => done(err));
  wr.on("close", (ex) => done());
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err === undefined ? 'File copied: ' + fn : err);
      cbCalled = true;
    }
  }
}

const options = {
  swSrc: './build/sw.js',
  swDest: './dist/service-worker.js',
  globDirectory: './dist',
  globPatterns: [
    "**/*.{js,txt,png,xml,css,eot,svg,ttf,woff,woff2,ico,jpg,json,html}"
  ],
  globIgnores: ['**/service-worker.js'],
  templatedUrls: {
    '/': ['index.html']
  },
  verbose: true
};

build.injectManifest(options).then(() => {
  console.log("Generated service worker with static cache");
}).catch((err) => {
  console.log('[ERROR] This happened: ' + err);
});
