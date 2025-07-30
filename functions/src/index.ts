import * as functions from 'firebase-functions/v2';
import express from "express"; // Still needed for type definition of 'express.Application'
import { join } from "path";
import { existsSync } from 'fs';

// Define paths relative to the 'functions' directory's root ('/workspace' in Cloud Functions).
const SERVER_DIST_FOLDER = join(process.cwd(), "dist/VisionPaidSurvey/server");

// Declare a variable to hold your Angular Universal Express app instance
let angularUniversalApp: express.Application;

// --- Dynamic Import of Angular Universal Server Bundle ---
const serverBundlePath = join(SERVER_DIST_FOLDER, "server.mjs");

// Log to confirm path before import
functions.logger.info(`--- Attempting to load Angular Universal App ---`);
functions.logger.info(`Server bundle path for import: ${serverBundlePath}`);
functions.logger.info(`File exists at serverBundlePath? ${existsSync(serverBundlePath)}`);

if (!existsSync(serverBundlePath)) {
    functions.logger.error(`❌ Angular server bundle NOT found at: ${serverBundlePath}. Cannot initialize SSR app.`);
    const fallbackApp = express();
    fallbackApp.get('*', (req, res) => res.status(500).send("SSR app bundle missing. Please check deployment."));
    angularUniversalApp = fallbackApp; // Assign a fallback app if bundle is missing
} else {
    try {
        // Dynamically import the server.mjs.
        // It's likely using commonjs 'require' within the compiled functions/lib/index.js
        // for better compatibility, so we'll use require here to get the exports.
        const serverModuleExports = require(serverBundlePath);

        // Access the 'app' export from the server.mjs module
        // This 'app' is the Express application instance configured by Angular Universal
        if (serverModuleExports && typeof serverModuleExports.app === 'function') {
            angularUniversalApp = serverModuleExports.app;
            functions.logger.info("✅ Successfully loaded Angular Universal Express app from 'app' export.");

            // Important: Your Angular Universal build *should* already handle serving static assets.
            // If it doesn't, or for specific assets like favicon.ico, add them here.
            // However, typical Universal setups handle `app.use(express.static(...))` internally.
            // If you find issues with static files not being served, you might uncomment/adjust this:
            /*
            angularUniversalApp.get('*.*', express.static(BROWSER_DIST_FOLDER, {
                maxAge: "1y" // Cache static assets for one year
            }));
            functions.logger.info(`Added static file serving from: ${BROWSER_DIST_FOLDER}`);
            */

        } else {
            functions.logger.error("❌ 'app' export not found or not a function in server.mjs. Check Angular Universal build configuration.");
            const fallbackApp = express();
            fallbackApp.get('*', (req, res) => res.status(500).send("SSR app export invalid. Check server.mjs."));
            angularUniversalApp = fallbackApp;
        }

    } catch (err: unknown) {
        functions.logger.error("❌ Failed to load Angular Universal app from server.mjs (initialization error):", err);
        const errorMessage = (err instanceof Error) ? err.stack || err.message : String(err);
        functions.logger.error(`❌ Full initialization error: ${errorMessage}`);
        const fallbackApp = express();
        fallbackApp.get('*', (req, res) => res.status(500).send("SSR app initialization failed. Check logs for details."));
        angularUniversalApp = fallbackApp; // Assign a fallback app on error
    }
}

// Export the SSR function with explicit resource configurations.
// The functions.https.onRequest now directly uses the 'angularUniversalApp' instance.
export const ssr = functions.https.onRequest({
    region: 'us-central1',
    maxInstances: 10,
    memory: "2GiB",
    cpu: 1
}, angularUniversalApp); // <-- THIS IS THE KEY CHANGE: Pass the imported Express app directly

// --- END SERVER CONFIGURATION ---

// Initial startup debug info
functions.logger.info('--- END OF SERVER SETUP LOGS ---');