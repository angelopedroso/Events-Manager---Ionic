import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParticipantesPageRoutingModule } from './participantes-routing.module';

import { ParticipantesPage } from './participantes.page';
import { HttpClientModule } from '@angular/common/http';
import { ParticipanteService } from './services/participante.service';
import { FormPageComponent } from './form-page/form-page.component';
import { DirectivesModule } from '@starley/ion-directives';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ParticipantesPageRoutingModule,
    FormPageComponent,
    DirectivesModule,
  ],
  declarations: [ParticipantesPage],
  providers: [ParticipanteService],
})
export class ParticipantesPageModule {}
