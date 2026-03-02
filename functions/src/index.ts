import * as functions from 'firebase-functions/v2';
import { join } from 'path';
import { existsSync } from 'fs';

// Export the SSR function
export const ssr = functions.https.onRequest({
  region: 'us-central1',
  maxInstances: 10,
  memory: "2GiB",
  cpu: 1
}, async (req, res) => {
  // Look for dist inside the functions folder itself
  const serverBundlePath = join(__dirname, "../dist/VisionPaidSurvey/server/server.mjs");

  if (!existsSync(serverBundlePath)) {
    return res.status(500).send(`SSR bundle not found at ${serverBundlePath}. Check deployment.`);
  }

  try {
    // Dynamically import the app exported from your server.ts
    const { app } = await import(`file://${serverBundlePath}`);
    return app(req, res);
  } catch (err) {
    console.error("Fatal SSR Error:", err);
    return res.status(500).send("Internal Server Error");
  }
});