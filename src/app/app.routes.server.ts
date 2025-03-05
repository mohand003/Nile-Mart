import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'brands/:id',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'categories/:id',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'details/:id',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
