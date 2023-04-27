import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { ParticipanteService } from 'src/app/participantes/services/participante.service';
import { ParticipanteInterface } from 'src/app/participantes/types/participante.interface';
import { OrganizadorInterface } from 'src/app/organizadores/types/organizador.interface';
import { OrganizadorService } from 'src/app/organizadores/services/organizador.service';
import { addressValidator, minSelectedCheckboxes } from '../utils/validators';

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
export class ModalComponentComponent implements OnInit, OnDestroy {
  @Input() valores!: EventoInterface;
  @Input() editLabel: boolean = false;

  subscription = new Subscription();
  formArray!: FormArray;
  eventoForm!: FormGroup;
  eventos!: number[];
  editMode: boolean = false;
  id!: number;
  actualDate: string = '';
  actualDateTime: string = '';

  dateTimeFormatted: string = '';

  organizadores: OrganizadorInterface[] = [];
  participantsInEvent!: (number | null)[];
  participantes: ParticipanteInterface[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private eventoService: EventoService,
    private participanteService: ParticipanteService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private organizadorService: OrganizadorService
  ) {
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000; //timezoneoffset in milliseconds
    const hoje = new Date(Date.now() - timezoneOffset).toISOString();
    this.actualDate = hoje.slice(0, 10);
    this.actualDateTime = hoje;

    this.organizadorService.getOrganizadores().subscribe({
      next: (organizador) => {
        this.organizadores = organizador;
      },
    });

    this.participanteService.getParticipantes().subscribe({
      next: (participante) => {
        this.participantes = participante;
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar os dados dos participantes',
          buttons: ['Ok'],
        });
        alerta.present();
        this.fecharModal();
      },
    });
  }

  ngOnInit(): void {
    if (this.valores) {
      this.dateTimeFormatted = `${this.valores.data}T${this.valores.hora}`;

      this.eventoForm = this.formBuilder.group({
        nome: [
          this.valores.nome,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        descricao: this.valores.descricao,
        endereco: [
          this.valores.endereco,
          [Validators.required, addressValidator()],
        ],
        data: [this.valores.data, Validators.required],
        hora: [this.valores.hora, Validators.required],
        organizadorId: [this.valores.organizadorId + '', Validators.required],
        participantes: new FormArray([], [minSelectedCheckboxes()]),
      });

      this.eventoService.getEvento(this.valores.id).subscribe({
        next: (evento) => {
          this.eventos = evento.participantes.map((ep) => ep.participanteId);

          this.participanteService.getParticipantes().subscribe({
            next: (participante) => {
              this.participantsInEvent = participante
                .map((p) => {
                  return this.eventos.includes(p.id) ? p.id : null;
                })
                .filter((pId) => pId !== null);
            },
          });
        },
        complete: () => {
          this.addCheckboxes();
        },
      });

      return;
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
      endereco: ['', [Validators.required, addressValidator()]],
      data: [''],
      hora: [''],
      organizadorId: ['', Validators.required],
      participantes: new FormArray([], [minSelectedCheckboxes()]),
    });

    this.addCheckboxes();
  }

  addCheckboxes(): void {
    this.participanteService.getParticipantes().subscribe({
      next: (participante) => {
        this.formArray = this.eventoForm.get('participantes') as FormArray;
        if (this.valores) {
          participante.forEach((p, i) => {
            const isChecked = this.participantsInEvent.includes(p.id);
            this.formArray.push(new FormControl(isChecked));
          });
        } else {
          participante.forEach((p, i) => {
            this.formArray.push(new FormControl(false));
          });
        }
      },
      error: async () => {
        const alerta = await this.alertController.create({
          header: 'Erro',
          message: 'Não foi possível carregar os dados dos participantes',
          buttons: ['Ok'],
        });
        alerta.present();
        this.fecharModal();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    const selectedParticipanteIds = this.eventoForm.value.participantes
      .map((checked: boolean, index: number) =>
        checked ? { participanteId: this.participantes[index].id } : null
      )
      .filter((value: { participanteId: number }) => value !== null);

    const formattedOrganizador = Number(this.eventoForm.value.organizadorId);

    const eventoData = this.eventoForm.getRawValue();
    eventoData.participantes = selectedParticipanteIds;
    eventoData.organizadorId = formattedOrganizador;

    if (this.valores) {
      this.eventoService
        .update({
          ...eventoData,
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
              message: 'Não foi possível atualizar os dados do evento.',
              buttons: ['Ok'],
            });
            alerta.present();
          },
        });
    } else {
      this.subscription.add(
        this.eventoService.save(eventoData).subscribe({
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
              message: 'Não foi possível salvar os dados do evento.',
              buttons: ['Ok'],
            });
            alerta.present();
          },
        })
      );
    }
  }

  fecharModal() {
    this.modalController.dismiss();
  }

  characterCounter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caracteres restantes`;
  }

  formatDateTime(event: any) {
    const datahora = event.detail.value as string;

    const [data, hora] = datahora.split('T');

    this.eventoForm.patchValue({ data: data, hora: hora.slice(0, 5) });
  }
}
