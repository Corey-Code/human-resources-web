import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(FormsModule),
    provideAnimations(),
  ],
};
