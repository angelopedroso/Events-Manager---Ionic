import { Component, OnInit } from '@angular/core';
import { EventoService } from '../eventos/services/evento.service';
import { EventoInterface } from '../eventos/types/evento.interface';
import { OrganizadorService } from '../organizadores/services/organizador.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  eventoParticipantes: number = 0;
  totalEventos: number = 0;
  totalOrganizadores: number = 0;

  constructor(
    private eventoService: EventoService,
    private organizadorService: OrganizadorService,
    private alertController: AlertController
  ) {
    this.eventoService.getEventos().subscribe({
      next: (evento) => {
        this.eventoParticipantes = evento.reduce((prev, next) => {
          return (prev += next.participantes.length);
        }, 0);

        this.totalEventos = evento.length;
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message:
            'Não foi possível carregar os dados relacionado ao(s) evento(s). Tente mais tarde!',
          buttons: ['Ok'],
        });
        alerta.present();
      },
    });

    this.organizadorService.getOrganizadores().subscribe({
      next: (organizador) => {
        this.totalOrganizadores = organizador.length;
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message:
            'Não foi possível carregar os dados relacionado ao(s) organizador(es). Tente mais tarde!',
          buttons: ['Ok'],
        });
        alerta.present();
      },
    });
  }

  ngOnInit() {}
}
