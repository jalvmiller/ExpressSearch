import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Configs globais do projeto; vai ser alterado para injetar o provideHttpClient()
// que permite que o Angular faça requisições HTTP para a API do backend

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Rotas
    provideRouter(routes),
    // Hidratação do lado do cliente
    provideClientHydration(withEventReplay()),
    // Requisições HTTP
    // o provideHttpClient permite que a aplicação
    // inteira tenha a capacidade de fazer chamadas AJAX (requisição API)
    provideHttpClient()
  ]
};
