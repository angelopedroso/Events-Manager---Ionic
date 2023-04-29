import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventoService } from '../eventos/services/evento.service';
import { OrganizadorService } from '../organizadores/services/organizador.service';
import { AlertController } from '@ionic/angular';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('graficoParticipantesEvento')
  graficoPE!: ElementRef;
  @ViewChild('graficoSlaoq', { static: true })
  graficoQ!: ElementRef;

  primaryColor = getComputedStyle(document.body).getPropertyValue(
    '--ion-color-primary'
  );

  eventoParticipantes = 0;
  eventoParticipantesPorEvento: number[] = [];
  nomeEventos: string[] = [];
  totalEventos = 0;
  totalOrganizadores = 0;

  constructor(
    private eventoService: EventoService,
    private organizadorService: OrganizadorService,
    private alertController: AlertController
  ) {}
  ngOnInit(): void {
    this.eventoService.getEventos().subscribe({
      next: (evento) => {
        this.eventoParticipantes = evento.reduce((prev, next) => {
          return (prev += next.participantes.length);
        }, 0);

        this.totalEventos = evento.length;

        this.eventoParticipantesPorEvento = evento.map((p) => {
          return p.participantes.length;
        });

        this.nomeEventos = evento.map((p) => {
          return p.nome;
        });

        this.graficoPartEmEventos();
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

  graficoPartEmEventos(): void {
    new Chart(this.graficoPE.nativeElement, {
      type: 'line',
      data: {
        labels: this.nomeEventos,
        datasets: [
          {
            data: this.eventoParticipantesPorEvento,
            borderColor: this.primaryColor,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
      },
    });
  }
}
