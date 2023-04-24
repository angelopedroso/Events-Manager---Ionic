import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosPage } from './eventos.page';
import { FormPageComponent } from './form-page/form-page.component';

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
  {
    path: 'cadastro',
    component: FormPageComponent,
  },
  {
    path: 'edicao/:id',
    component: FormPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosPageRoutingModule {}
