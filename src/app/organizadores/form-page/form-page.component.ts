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
import { cpfValidator, validateNameInput } from '../utils/validationForm';

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
      this.valores.telefone = this.formatarTelefoneExibicao(
        this.valores.telefone
      );
      this.organizadorForm = this.formBuilder.group({
        nomeResponsavel: [
          this.valores.nomeResponsavel,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            validateNameInput(),
          ],
        ],
        nomeEmpresa: this.valores.nomeEmpresa,
        telefone: [this.valores.telefone, [Validators.required]],
        email: [this.valores.email, [Validators.required, Validators.email]],
        cpf: [this.valores.cpf, [Validators.minLength(14)]],
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
          validateNameInput(),
        ],
      ],
      nomeEmpresa: '',
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.minLength(14), cpfValidator()]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (!this.valores) {
      const telefone = this.organizadorForm.get('telefone')!.value;

      const telefoneFormatado = this.formatarNumeroTelefone(telefone);

      this.organizadorForm.patchValue({
        telefone: telefoneFormatado,
      });

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

  formatarTelefoneExibicao(telefone: string): string {
    if (telefone.length === 11) {
      return `(${telefone.slice(0, 2)})${telefone.slice(2, 7)}-${telefone.slice(
        7
      )}`;
    } else {
      return telefone;
    }
  }

  formatarNumeroTelefone(numero: string): string {
    return numero.replace(/\D/g, '');
  }
}
