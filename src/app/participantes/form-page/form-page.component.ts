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
import { ParticipanteService } from '../services/participante.service';
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
import { ParticipanteInterface } from '../types/participante.interface';

@Component({
  selector: 'app-participante-form-page',
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
  @Input() valores!: ParticipanteInterface;
  @Input() editLabel: boolean = false;

  participanteForm!: FormGroup;
  subscription = new Subscription();
  createMode: boolean = false;
  id!: number;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private participanteService: ParticipanteService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    if (this.valores) {
      this.valores.telefone = this.formatarTelefoneExibicao(
        this.valores.telefone
      );

      this.participanteForm = this.formBuilder.group({
        nome: [
          this.valores.nome,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        sobrenome: [
          this.valores.sobrenome,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        telefone: [
          this.valores.telefone,
          [Validators.required, this.phoneValidator()],
        ],
        email: [this.valores.email, [Validators.required, Validators.email]],
        genero: [this.valores.genero, [Validators.required]],
      });
      return;
    }

    this.participanteForm = this.formBuilder.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      sobrenome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      telefone: ['', [Validators.required, this.phoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', [Validators.required]],
    });
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phonePattern = /^\(\d{2}\)\s?\d{1}\s?\d{4}-\d{4}$/;
      if (control.value && !phonePattern.test(control.value)) {
        return { invalidPhone: true };
      }
      return null;
    };
  }

  formatarNumeroTelefone(numero: string): string {
    return numero.replace(/\D/g, '');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (!this.valores) {
      const telefone = this.participanteForm.get('telefone')!.value;

      const telefoneFormatado = this.formatarNumeroTelefone(telefone);

      this.participanteForm.patchValue({
        telefone: telefoneFormatado,
      });

      this.subscription.add(
        this.participanteService.save(this.participanteForm.value).subscribe({
          next: async () => {
            const toast = await this.toastController.create({
              color: 'success',
              message: 'Participante cadastrado com sucesso! 🎉',
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
              message: 'Não foi possível salvar os dados do participante',
              buttons: ['Ok'],
            });
            alerta.present();
          },
        })
      );
    } else {
      this.participanteService
        .update({
          ...this.participanteForm.value,
          id: this.valores.id,
        })
        .subscribe({
          next: async () => {
            const toast = await this.toastController.create({
              color: 'success',
              message: 'Participante atualizado com sucesso! 🎉',
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
              message: 'Não foi possível atualizar os dados do participante',
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

  formatarTelefoneExibicao(telefone: string): string {
    if (telefone.length === 11) {
      return `(${telefone.slice(0, 2)})${telefone.slice(2, 7)}-${telefone.slice(
        7
      )}`;
    } else {
      return telefone;
    }
  }
}
