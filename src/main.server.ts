import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';

// Angular 20 expects the context to be the official BootstrapContext
const bootstrap = (context?: BootstrapContext) =>
  bootstrapApplication(AppComponent, config, context);

export default bootstrap;
