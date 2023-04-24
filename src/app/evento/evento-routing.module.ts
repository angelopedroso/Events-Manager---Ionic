import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EventoCadastroComponent } from './components/cadastro/evento-cadastro.component';
import { EventoListaComponent } from './components/lista/evento-lista.component';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: EventoListaComponent,
  },
  {
    path: 'cadastro',
    component: EventoCadastroComponent,
  },
  {
    path: 'edicao/:id',
    component: EventoCadastroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoRoutingModule {}
