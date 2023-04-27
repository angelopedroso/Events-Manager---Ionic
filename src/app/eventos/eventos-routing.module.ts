import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosPage } from './eventos.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: EventosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosPageRoutingModule {}
