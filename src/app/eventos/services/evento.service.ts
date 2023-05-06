import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventoInterface } from '../types/evento.interface';
import { OrganizadorInterface } from 'src/app/organizadores/types/organizador.interface';

interface ContagemOrganizadores {
  [id: number]: number;
}

@Injectable()
export class EventoService {
  constructor(private http: HttpClient) {}

  getEvento(id: number): Observable<EventoInterface> {
    return this.http.get<EventoInterface>(
      `${environment.apiUrl}/eventos/${id}`
    );
  }

  getEventos(): Observable<EventoInterface[]> {
    return this.http.get<EventoInterface[]>(`${environment.apiUrl}/eventos`);
  }

  save(evento: EventoInterface): Observable<EventoInterface> {
    return this.http.post<EventoInterface>(
      `${environment.apiUrl}/eventos`,
      evento
    );
  }

  update(evento: EventoInterface): Observable<EventoInterface> {
    return this.http.put<EventoInterface>(
      `${environment.apiUrl}/eventos/${evento.id}`,
      evento
    );
  }

  remove({ id }: EventoInterface): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/eventos/${id}`);
  }

  getOrganizadoresMaisAtivos(
    top = 3
  ): Observable<{ nome: string; quantidade: number }[]> {
    return this.http
      .get<EventoInterface[]>(`${environment.apiUrl}/eventos`)
      .pipe(
        mergeMap((eventos) => {
          const idsOrganizadores = eventos.map(
            (evento) => evento.organizadorId
          );
          const contagemOrganizadores: ContagemOrganizadores =
            idsOrganizadores.reduce((contagem: ContagemOrganizadores, id) => {
              contagem[id] = contagem[id] ? contagem[id] + 1 : 1;
              return contagem;
            }, {});

          const idsOrganizadoresMaisAtivos = Object.keys(contagemOrganizadores)
            .sort(
              (id1, id2) =>
                contagemOrganizadores[+id2] - contagemOrganizadores[+id1]
            )
            .slice(0, top);

          return this.http
            .get<OrganizadorInterface[]>(`${environment.apiUrl}/organizadores`)
            .pipe(
              map((organizadores) => {
                const organizadoresMap: { [id: number]: OrganizadorInterface } =
                  {};
                organizadores.forEach((organizador) => {
                  organizadoresMap[organizador.id] = organizador;
                });
                return idsOrganizadoresMaisAtivos.map((id) => {
                  const quantidade = contagemOrganizadores[+id];
                  const nome = organizadoresMap[+id].nomeResponsavel;
                  return { nome, quantidade };
                });
              })
            );
        })
      );
  }
}
