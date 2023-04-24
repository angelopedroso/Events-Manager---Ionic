import { Component, OnDestroy } from '@angular/core';
import {
  AlertController,
  AnimationController,
  LoadingController,
  ModalController,
  ToastController,
  ViewDidLeave,
  ViewWillEnter,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ParticipanteService } from './services/participante.service';
import { ParticipanteInterface } from './types/participante.interface';
import { Router } from '@angular/router';
import { FormPageComponent } from './form-page/form-page.component';

@Component({
  selector: 'app-participante-list-page',
  templateUrl: './participantes.page.html',
  styleUrls: ['./participantes.page.scss'],
})
export class ParticipantesPage
  implements ViewWillEnter, ViewDidLeave, OnDestroy
{
  participantes: ParticipanteInterface[] = [];
  subscriptions = new Subscription();
  modal!: HTMLIonModalElement;

  constructor(
    private participanteService: ParticipanteService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private animationCtrl: AnimationController,
    public modalController: ModalController
  ) {}

  ionViewDidLeave(): void {
    this.participantes = [];
  }

  ionViewWillEnter(): void {
    this.listar();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async listar() {
    const busyLoader = await this.loadingController.create({
      spinner: 'circular',
    });
    busyLoader.present();

    const subscription = this.participanteService.getParticipantes().subscribe({
      next: async (participantes) => {
        this.participantes = participantes;
        busyLoader.dismiss();
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar a lista de participantes',
          buttons: ['Ok'],
        });
        alerta.present();
        busyLoader.dismiss();
        this.router.navigate(['/home']);
      },
    });
    this.subscriptions.add(subscription);
  }

  async remove(participante: ParticipanteInterface) {
    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir o participante ${participante.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.subscriptions.add(
              this.participanteService
                .remove(participante)
                .subscribe(() => this.listar())
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
      component: FormPageComponent,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });

    modal.onWillDismiss().then(async () => {
      this.atualizarLista();
    });

    await modal.present();
  }

  async handleEditParticipante(id: number) {
    if (id) {
      this.participanteService.getParticipante(id).subscribe({
        next: async (participante) => {
          const modal = await this.modalController.create({
            component: FormPageComponent,
            componentProps: {
              valores: {
                id: id,
                nome: participante.nome,
                sobrenome: participante.sobrenome || '',
                telefone: participante.telefone,
                email: participante.email,
              },
              editLabel: true,
            },
            enterAnimation: this.enterAnimation,
            leaveAnimation: this.leaveAnimation,
          });

          modal.onWillDismiss().then(async () => {
            this.atualizarLista();
          });

          await modal.present();
        },
        error: async (erro) => {
          const alerta = await this.alertController.create({
            header: 'Erro',
            message: `Não foi possível carregar os dados do participante. Erro: ${erro}`,
            buttons: ['Ok'],
          });
          alerta.present();
        },
      });
    }
  }

  atualizarLista(): void {
    const subscription = this.participanteService.getParticipantes().subscribe({
      next: async (participantes) => {
        this.participantes = participantes;
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar a lista de participantes',
          buttons: ['Ok'],
        });
        alerta.present();

        this.router.navigate(['/home']);
      },
    });
    this.subscriptions.add(subscription);
  }
}
