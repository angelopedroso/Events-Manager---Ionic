import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { EventoCadastroComponent } from './components/cadastro/evento-cadastro.component';
import { EventoListaComponent } from './components/lista/evento-lista.component';
import { EventoRoutingModule } from './evento-routing.module';
import { EventoService } from './services/evento.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EventoRoutingModule,
  ],
  declarations: [EventoListaComponent, EventoCadastroComponent],
  providers: [EventoService],
})
export class EventoModule {}
