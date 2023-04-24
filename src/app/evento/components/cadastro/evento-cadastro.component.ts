import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { EventoInterface } from '../../types/evento.interface';

@Component({
  selector: 'app-evento-cadastro',
  templateUrl: './evento-cadastro.component.html',
})
export class EventoCadastroComponent implements OnInit {
  eventoForm: FormGroup = this.formBuilder.group({
    id: 0,
    nome: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(200)],
    ],
    autor: [
      '',
      [Validators.minLength(3), Validators.maxLength(150), Validators.required],
    ],
    preco: 0,
    publicacao: '2000-01-01',
  });

  edicao: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private eventoService: EventoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params['id'];
    this.edicao = !!id;

    if (id) {
      this.eventoService.getEvento(id).subscribe(
        (evento) => {
          console.log(evento);
          this.eventoForm.patchValue(evento);
        },
        (erro) => {
          console.log('Erro: ', erro);
        }
      );
    }
  }

  onSubmit() {
    console.log(this.eventoForm.valid);
    console.log(this.eventoForm.value);

    const evento: EventoInterface = this.eventoForm.value;

    if (evento.id) {
      this.eventoService.update(evento).subscribe(() => this.redirect());
    } else {
      this.eventoService.save(evento).subscribe(() => this.redirect());
    }
  }

  redirect() {
    this.router.navigate(['eventos', 'lista']);
  }
}
