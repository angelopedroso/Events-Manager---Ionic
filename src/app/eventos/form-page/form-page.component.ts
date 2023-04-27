import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { OrganizadorService } from 'src/app/organizadores/services/organizador.service';
import { OrganizadorInterface } from 'src/app/organizadores/types/organizador.interface';

@Component({
  selector: 'app-form-page',
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
  @Input() valores!: EventoInterface;
  @Input() editLabel: boolean = false;

  eventoForm!: FormGroup;
  subscription = new Subscription();
  createMode: boolean = false;
  editMode: boolean = false;
  id!: number;
  actualDate: string = '';
  organizadores: OrganizadorInterface[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private eventoService: EventoService,
    private alertController: AlertController,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private organizadorService: OrganizadorService
  ) {
    const today = new Date();
    this.actualDate = today.toISOString().slice(0, 10);

    this.organizadorService.getOrganizadores().subscribe({
      next: (organizador) => {
        this.organizadores = organizador;
      },
    });
  }

  ngOnInit(): void {
    const [url] = this.activatedRoute.snapshot.url;
    this.editMode = url.path === 'edicao';
    this.createMode = !this.editMode;

    if (this.editMode) {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      this.id = id ? parseInt(id) : -1;

      if (this.id !== -1) {
        this.eventoService.getEvento(this.id).subscribe((evento) => {
          this.eventoForm = this.formBuilder.group({
            nome: evento.nome,
            descricao: evento.descricao || '',
            data: evento.data,
            hora: evento.hora,
            organizador: evento.organizadorId,
            participantes: evento.participantes,
            endereco: evento.endereco,
          });
        });
      }
    }
    this.eventoForm = this.formBuilder.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      descricao: '',
      endereco: ['', Validators.required, this.addressValidator()],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      organizador: ['', Validators.required],
      participantes: [[], Validators.required],
    });
  }

  addressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const address = control.value;
      if (!address) {
        return null;
      }

      const regex = /^[A-Za-z0-9\s\,\.\-\/\(\)]+$/;
      if (!regex.test(address)) {
        return { invalidAddress: true };
      }
      return null;
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    if (this.createMode) {
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
            this.router.navigate(['./eventos']);
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
            this.router.navigate(['./eventos']);
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

  characterCounter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caracteres restantes`;
  }
}
