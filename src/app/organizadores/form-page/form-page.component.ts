import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizadorService } from '../services/organizador.service';
import { Subscription } from 'rxjs';
import {
  AlertController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DirectivesModule } from '@starley/ion-directives';
import { OrganizadorInterface } from '../types/organizador.interface';

@Component({
  selector: 'app-organizador-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
})
export class FormPageComponent implements OnInit, OnDestroy {
  @Input() valores!: OrganizadorInterface;
  @Input() editLabel: boolean = false;

  organizadorForm!: FormGroup;
  subscription = new Subscription();
  id!: number;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private organizadorService: OrganizadorService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    if (this.valores) {
      this.organizadorForm = this.formBuilder.group({
        nomeResponsavel: [
          this.valores.nomeResponsavel,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            this.validateNameInput(),
          ],
        ],
        nomeEmpresa: this.valores.nomeEmpresa,
        telefone: [this.valores.telefone, [Validators.required]],
        email: [this.valores.email, [Validators.required, Validators.email]],
      });
      return;
    }

    this.organizadorForm = this.formBuilder.group({
      nomeResponsavel: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.validateNameInput(),
        ],
      ],
      nomeEmpresa: '',
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  validateNameInput(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const name = control.value;
      if (name.trim().length === 0) {
        return null;
      }

      const namePattern = /^[a-zA-Z\u00C7\u00E7\s]*$/;
      if (control.value && !namePattern.test(control.value)) {
        return { invalidName: true };
      }
      return null;
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (!this.valores) {
      this.subscription.add(
        this.organizadorService.save(this.organizadorForm.value).subscribe({
          next: async () => {
            const toast = await this.toastController.create({
              color: 'success',
              message: 'Organizador cadastrado com sucesso! 🎉',
              duration: 4000,
              buttons: ['✖'],
              icon: 'checkmark',
              position: 'top',
              animated: true,
            });
            toast.present();
            this.fecharModal();
          },
          error: async () => {
            const alerta = await this.alertController.create({
              header: 'Erro',
              message: 'Não foi possível salvar os dados do organizador',
              buttons: ['Ok'],
            });
            alerta.present();
          },
        })
      );
    } else {
      this.organizadorService
        .update({
          ...this.organizadorForm.value,
          id: this.valores.id,
        })
        .subscribe({
          next: async () => {
            const toast = await this.toastController.create({
              color: 'success',
              message: 'Organizador atualizado com sucesso! 🎉',
              duration: 4000,
              buttons: ['✖'],
              icon: 'checkmark',
              position: 'top',
              animated: true,
            });
            toast.present();
            this.fecharModal();
          },
          error: async () => {
            const alerta = await this.alertController.create({
              header: 'Erro',
              message: 'Não foi possível atualizar os dados do organizador',
              buttons: ['Ok'],
            });
            alerta.present();
          },
        });
    }
  }

  fecharModal() {
    this.modalController.dismiss();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key !== undefined && isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }
}
