import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import { HttpClientModule } from '@angular/common/http';
import { FormPageComponent } from './form-page/form-page.component';
import { DirectivesModule } from '@starley/ion-directives';
import { EventoService } from './services/evento.service';
import { OrganizadorService } from '../organizadores/services/organizador.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    EventosPageRoutingModule,
    FormPageComponent,
    DirectivesModule,
  ],
  declarations: [EventosPage],
  providers: [EventoService, OrganizadorService],
})
export class EventosPageModule {}
