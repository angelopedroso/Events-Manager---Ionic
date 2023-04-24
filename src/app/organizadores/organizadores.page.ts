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
import { OrganizadorService } from './services/organizador.service';
import { OrganizadorInterface } from './types/organizador.interface';
import { Router } from '@angular/router';
import { FormPageComponent } from './form-page/form-page.component';

@Component({
  selector: 'app-organizador-list-page',
  templateUrl: './organizadores.page.html',
  styleUrls: ['./organizadores.page.scss'],
})
export class OrganizadoresPage
  implements ViewWillEnter, ViewDidLeave, OnDestroy
{
  organizadores: OrganizadorInterface[] = [];
  subscriptions = new Subscription();
  modal!: HTMLIonModalElement;

  constructor(
    private organizadorService: OrganizadorService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private animationCtrl: AnimationController,
    public modalController: ModalController
  ) {}

  ionViewDidLeave(): void {
    this.organizadores = [];
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

    const subscription = this.organizadorService.getOrganizadores().subscribe({
      next: async (organizadores) => {
        this.organizadores = organizadores;
        busyLoader.dismiss();
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar a lista de organizadores',
          buttons: ['Ok'],
        });
        alerta.present();
        busyLoader.dismiss();
        this.router.navigate(['/home']);
      },
    });
    this.subscriptions.add(subscription);
  }

  async remove(organizador: OrganizadorInterface) {
    const alert = await this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir o organizador ${organizador.nomeResponsavel}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.subscriptions.add(
              this.organizadorService
                .remove(organizador)
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

  async handleEditOrganizador(id: number) {
    if (id) {
      this.organizadorService.getOrganizador(id).subscribe({
        next: async (organizador) => {
          const modal = await this.modalController.create({
            component: FormPageComponent,
            componentProps: {
              valores: {
                id: id,
                nomeResponsavel: organizador.nomeResponsavel,
                nomeEmpresa: organizador.nomeEmpresa || '',
                telefone: organizador.telefone,
                email: organizador.email,
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
            message: `Não foi possível carregar os dados do organizador. Erro: ${erro}`,
            buttons: ['Ok'],
          });
          alerta.present();
        },
      });
    }
  }

  atualizarLista(): void {
    const subscription = this.organizadorService.getOrganizadores().subscribe({
      next: async (organizadores) => {
        this.organizadores = organizadores;
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar a lista de organizadores',
          buttons: ['Ok'],
        });
        alerta.present();

        this.router.navigate(['/home']);
      },
    });
    this.subscriptions.add(subscription);
  }
}
