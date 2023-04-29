import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { EventoService } from '../eventos/services/evento.service';
import { HttpClientModule } from '@angular/common/http';
import { OrganizadorService } from '../organizadores/services/organizador.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,
  ],
  declarations: [HomePage],
  providers: [EventoService, OrganizadorService],
})
export class HomePageModule {}
