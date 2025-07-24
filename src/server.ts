import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const app = express();
const angularApp = new AngularNodeAppEngine();

const browserDistFolder = join(import.meta.dirname, '../browser');

app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false
}));

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        res.status(404).send('Page not found');
      }
    })
    .catch(next);
});

// ✅ Always start server in both local & Cloud Functions
const port = Number(process.env['PORT'] || 8080);
app.listen(port, () => {
  console.log(`✅ SSR server is listening on http://localhost:${port}`);
});

// ✅ Export for Firebase Functions to import
export { app };
