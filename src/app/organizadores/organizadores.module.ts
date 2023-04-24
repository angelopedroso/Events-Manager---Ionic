import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizadoresPageRoutingModule } from './organizadores-routing.module';

import { OrganizadoresPage } from './organizadores.page';
import { HttpClientModule } from '@angular/common/http';
import { OrganizadorService } from './services/organizador.service';
import { FormPageComponent } from './form-page/form-page.component';
import { DirectivesModule } from '@starley/ion-directives';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    OrganizadoresPageRoutingModule,
    FormPageComponent,
    DirectivesModule,
  ],
  declarations: [OrganizadoresPage],
  providers: [OrganizadorService],
})
export class OrganizadoresPageModule {}
