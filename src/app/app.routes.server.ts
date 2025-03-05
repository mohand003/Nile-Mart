import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'brands/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'categories/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'details/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
