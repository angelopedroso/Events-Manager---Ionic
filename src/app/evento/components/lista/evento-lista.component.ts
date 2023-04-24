import { Component, Inject, OnInit } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { EventoInterface } from '../../types/evento.interface';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
})
export class EventoListaComponent implements OnInit {
  eventos: EventoInterface[] = [];

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.list();
  }
  list() {
    this.eventoService.getEventos().subscribe(
      (eventos) => {
        this.eventos = eventos;
      },
      (erro) => {
        console.log('Erro: ', erro);
      },
      () => {
        console.log('Terminou!');
      }
    );
  }

  remove(evento: EventoInterface) {
    this.eventoService.remove(evento).subscribe(
      () => this.list(),
      (erro) => {
        console.log('Erro: ', erro);
      },
      () => {
        console.log('Terminou!');
      }
    );
  }
}
