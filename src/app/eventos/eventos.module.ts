import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import { HttpClientModule } from '@angular/common/http';
import { DirectivesModule } from '@starley/ion-directives';
import { EventoService } from './services/evento.service';
import { OrganizadorService } from '../organizadores/services/organizador.service';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { ParticipanteService } from '../participantes/services/participante.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    EventosPageRoutingModule,
    ModalComponentComponent,
    DirectivesModule,
  ],
  declarations: [EventosPage],
  providers: [EventoService, OrganizadorService, ParticipanteService],
})
export class EventosPageModule {}
