import * as functions from "firebase-functions";
import express from "express";
import {join} from "path";

// If you need Firebase Admin SDK in your SSR function, uncomment and initialize:
// import * as admin from 'firebase-admin';
// admin.initializeApp();

const BROWSER_DIST_FOLDER = join(process.cwd(), "dist/VisionPaidSurvey/browser");
const SERVER_DIST_FOLDER = join(process.cwd(), "dist/VisionPaidSurvey/server");

const app = express();

// Serve static files from the browser bundle
app.get("*.*", express.static(BROWSER_DIST_FOLDER, {
  maxAge: "1y",
}));

// Dynamically import the Angular Universal server bundle
// This handles the `no-var-requires` error and `max-len` by breaking the line.
// We only destructure 'AppServerModule' and 'renderModule' as they are commonly used.
// Adjust destructuring based on what your server.mjs actually exports for the handler.
import(join(SERVER_DIST_FOLDER, "server.mjs"))
  .then(({AppServerModule, renderModule}) => {
    // All other routes should be handled by Angular server-side rendering
    app.get("*", (req, res) => {
      renderModule(AppServerModule, {
        url: req.originalUrl,
        document: "", // Provide a basic document or leave empty for Angular to fill
        extraProviders: [],
      }).then((html: string) => res.send(html))
        .catch((err: unknown) => { // Use 'unknown' instead of 'any' for errors
          functions.logger.error("SSR Error:", err);
          res.status(500).send("Server-side rendering failed."); // Send a generic error response
        });
    });
  })
  .catch((err: unknown) => { // Catch errors during dynamic import
    functions.logger.error("Failed to load Angular Universal server bundle:", err);
    // Handle the error if the server bundle cannot be loaded
    app.get("*", (req, res) => {
      res.status(500).send("SSR application failed to load.");
    });
  });

export const ssr = functions.https.onRequest(app);

// Example of another function (if needed), using v2 functions syntax
// export const helloWorld = functions.https.onRequest((req, res) => {
//   res.send("Hello from Firebase V2!");
// });
