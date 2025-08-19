import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import path from 'node:path';
import * as fs from 'node:fs';

const app = express(); // Define app outside to be accessible
const angularApp = new AngularNodeAppEngine();

// --- CRITICAL FIX: Adjust browserDistFolder calculation for deployment environment ---
// `import.meta.dirname` refers to the directory of the current module (e.g., dist/VisionPaidSurvey/server).
// We go up one level ('..') from 'server' to 'VisionPaidSurvey', then into 'browser'.
const serverModuleDir = import.meta.dirname;
const browserDistFolder = path.resolve(serverModuleDir, '..', 'browser');
// --- END CRITICAL FIX ---


// --- CRITICAL DEBUGGING START (Keep these for now, remove once confirmed working, especially on Firebase) ---
console.log('--- SERVER STARTUP DEBUG INFO ---');
console.log(`Node.js process CWD: ${process.cwd()}`);
console.log(`Server module directory (import.meta.dirname): ${serverModuleDir}`);
console.log(`Calculated browser dist folder for static assets (FIXED): ${browserDistFolder}`);

const testPolyfillsPath = path.join(browserDistFolder, 'polyfills.js');
if (fs.existsSync(testPolyfillsPath)) {
  console.log(`CONFIRMED: polyfills.js exists at calculated path: ${testPolyfillsPath}`);
} else {
  console.error(`ERROR: polyfills.js NOT found at calculated path: ${testPolyfillsPath}. (Expected for exact filename match, check hashed assets in browser.)`);
}

const testSurveyImagePath = path.join(browserDistFolder, 'assets', 'images', 'icon', 'survey.png');
if (fs.existsSync(testSurveyImagePath)) {
  console.log(`CONFIRMED: survey.png exists at calculated path: ${testSurveyImagePath}`);
} else {
  console.error(`ERROR: survey.png NOT found at calculated path: ${testSurveyImagePath}.`);
}
console.log('--- END SERVER STARTUP DEBUG INFO ---');


app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false, // Important: Don't serve index.html directly for SSR routes
  redirect: false // Prevents express from redirecting trailing slashes
}));


// ✅ Sitemap route – generate XML dynamically
app.get('/sitemap.xml', (_req, res) => {
  const hostname = 'https://www.profitpiller.com';
  const staticRoutes = [
    '', 'aboutus', 'amazongiftcard', 'cashout', 'contactus', 'do-not-sell',
    'giftcard', 'help', 'paypal', 'privacy-policy', 'terms-conditions', 'visa',
    'auth/login', 'auth/forgot-password',
    'app/survey', 'app/offers', 'app/offerwall', 'app/cashout', 'app/leaderboard',
    'app/account', 'app/help', 'app/refer', 'app/redeem',
    'survey/completesurvey', 'survey/getSurveyInventory', 'survey/takeSurvey',
    'admin/user-admin-dashboard'
  ];

  const dynamicRoutes = [
    'auth'
  ];

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const urls = allRoutes.map(route => `
    <url>
      <loc>${hostname}/${route}</loc>
    </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap.trim());
});

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        console.warn(`No response from Angular SSR for ${req.url}. Returning 404.`);
        res.status(404).send('Page not found');
      }
    })
    .catch(next); // Pass errors to the next error handling middleware
});

// IMPORTANT: REMOVE THIS app.listen() BLOCK FOR FIREBASE FUNCTIONS!
// Firebase Functions will handle the listening on the correct port internally.

// const port = Number(process.env['PORT'] || 8080);
// app.listen(port, () => {
//   console.log(`✅ SSR server is listening on http://localhost:${port}`);
// });


// Export the Express app instance. This is what Firebase Functions (functions/src/index.ts)
// will import and use with `functions.https.onRequest(server.app)`.
export { app };