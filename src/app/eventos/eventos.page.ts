import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  AnimationController,
  LoadingController,
  ModalController,
  ToastController,
  ViewDidLeave,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EventoService } from './services/evento.service';
import { EventoInterface } from './types/evento.interface';
import { Router } from '@angular/router';
import { OrganizadorService } from '../organizadores/services/organizador.service';
import { OrganizadorInterface } from '../organizadores/types/organizador.interface';
import { ModalComponentComponent } from './modal-component/modal-component.component';

@Component({
  selector: 'app-evento-list-page',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements ViewDidLeave, OnDestroy, OnInit {
  eventos: EventoInterface[] = [];
  organizadores: OrganizadorInterface[] = [];
  subscriptions = new Subscription();
  modal!: HTMLIonModalElement;

  constructor(
    private eventoService: EventoService,
    private organizadorService: OrganizadorService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private animationCtrl: AnimationController,
    public modalController: ModalController
  ) {}
  ngOnInit(): void {
    this.listar();

    this.organizadorService.getOrganizadores().subscribe({
      next: (organizadores) => {
        this.organizadores = organizadores;
      },
      error: (erro) => {
        console.log('Erro: ', erro);
      },
    });
  }

  ionViewDidLeave(): void {
    this.eventos = [];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async listar() {
    const busyLoader = await this.loadingController.create({
      spinner: 'circular',
    });
    busyLoader.present();

    const subscription = this.eventoService.getEventos().subscribe({
      next: async (eventos) => {
        this.eventos = eventos;
        busyLoader.dismiss();
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar a lista de eventos',
          buttons: ['Ok'],
        });
        alerta.present();
        busyLoader.dismiss();
        this.router.navigate(['/home']);
      },
    });
    this.subscriptions.add(subscription);
  }

  async remove(evento: EventoInterface) {
    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir o evento ${evento.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.subscriptions.add(
              this.eventoService.remove(evento).subscribe(() => this.listar())
            );
          },
        },
        'Não',
      ],
    });
    alert.present();
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponentComponent,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['inline_modal'],
    });

    modal.onWillDismiss().then(async () => {
      this.atualizarLista();
    });

    await modal.present();
  }

  async handleEditEvento(id: number) {
    if (id) {
      this.eventoService.getEvento(id).subscribe({
        next: async (evento) => {
          const modal = await this.modalController.create({
            component: ModalComponentComponent,
            componentProps: {
              valores: {
                id: id,
                nome: evento.nome,
                descricao: evento.descricao || '',
                data: evento.data,
                hora: evento.hora,
                endereco: evento.endereco,
                organizador: evento.organizador.id,
                participantes: evento.participantes,
              },
              editLabel: true,
            },
            enterAnimation: this.enterAnimation,
            leaveAnimation: this.leaveAnimation,
            cssClass: ['inline_modal'],
          });

          modal.onWillDismiss().then(async () => {
            this.atualizarLista();
          });

          await modal.present();
        },
        error: async (erro) => {
          const alerta = await this.alertController.create({
            header: 'Erro',
            message: `Não foi possível carregar os dados do evento. Erro: ${erro}`,
            buttons: ['Ok'],
          });
          alerta.present();
        },
      });
    }
  }

  atualizarLista(): void {
    const subscription = this.eventoService.getEventos().subscribe({
      next: async (eventos) => {
        this.eventos = eventos;
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar a lista de eventos',
          buttons: ['Ok'],
        });
        alerta.present();

        this.router.navigate(['/home']);
      },
    });
    this.subscriptions.add(subscription);
  }

  getOrganizadorName(organizadorId: string | undefined): string {
    return (
      this.organizadores.find((organizador) => organizador.id === organizadorId)
        ?.nomeResponsavel || 'Organizador não identificado'
    );
  }
}
