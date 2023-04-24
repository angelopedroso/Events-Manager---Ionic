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
import { EventoService } from '../services/evento.service';
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
import { EventoInterface } from '../types/evento.interface';

@Component({
  selector: 'app-modal-component-page',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss'],
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
  @Input() valores!: EventoInterface;
  @Input() editLabel: boolean = false;

  eventoForm!: FormGroup;
  subscription = new Subscription();
  createMode: boolean = false;
  editMode: boolean = false;
  id!: number;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private eventoService: EventoService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    // if (this.valores) {
    //   this.eventoForm = this.formBuilder.group({
    //     nome: [
    //       this.valores.nome,
    //       [
    //         Validators.required,
    //         Validators.minLength(3),
    //         Validators.maxLength(20),
    //       ],
    //     ],
    //     sobrenome: [
    //       this.valores.sobrenome,
    //       [
    //         Validators.required,
    //         Validators.minLength(3),
    //         Validators.maxLength(20),
    //       ],
    //     ],
    //     telefone: [
    //       this.valores.telefone,
    //       [Validators.required, this.phoneValidator()],
    //     ],
    //     email: [this.valores.email, [Validators.required, Validators.email]],
    //   });
    //   return;
    // }
    // this.eventoForm = this.formBuilder.group({
    //   nome: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(3),
    //       Validators.maxLength(20),
    //     ],
    //   ],
    //   sobrenome: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(3),
    //       Validators.maxLength(20),
    //     ],
    //   ],
    //   telefone: ['', [Validators.required, this.phoneValidator()]],
    //   email: ['', [Validators.required, Validators.email]],
    // });
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (!this.valores) {
      this.subscription.add(
        this.eventoService.save(this.eventoForm.value).subscribe({
          next: async () => {
            const toast = await this.toastController.create({
              color: 'success',
              message: 'Evento cadastrado com sucesso! 🎉',
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
              message: 'Não foi possível salvar os dados do evento',
              buttons: ['Ok'],
            });
            alerta.present();
          },
        })
      );
    } else {
      this.eventoService
        .update({
          ...this.eventoForm.value,
          id: this.valores.id,
        })
        .subscribe({
          next: async () => {
            const toast = await this.toastController.create({
              color: 'success',
              message: 'Evento atualizado com sucesso! 🎉',
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
              message: 'Não foi possível atualizar os dados do evento',
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
}
