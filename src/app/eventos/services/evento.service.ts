import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventoInterface } from '../types/evento.interface';
import { OrganizadorInterface } from 'src/app/organizadores/types/organizador.interface';

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
        map((eventos) => {
          const contagemOrganizadores: { [id: number]: number } = {};

          eventos.forEach((evento) => {
            const organizadorId = evento.organizadorId;
            contagemOrganizadores[organizadorId] =
              (contagemOrganizadores[organizadorId] || 0) + 1;
          });

          const idsOrganizadoresMaisAtivos = Object.keys(contagemOrganizadores)
            .sort(
              (id1, id2) =>
                contagemOrganizadores[+id2] - contagemOrganizadores[+id1]
            )
            .slice(0, top);

          return idsOrganizadoresMaisAtivos.map((id) => {
            const quantidade = contagemOrganizadores[+id];
            return { id, quantidade };
          });
        }),
        switchMap((organizadoresMaisAtivos) => {
          return this.http
            .get<OrganizadorInterface[]>(`${environment.apiUrl}/organizadores`)
            .pipe(
              map((organizadores) => {
                const organizadoresMap: { [id: number]: OrganizadorInterface } =
                  {};
                organizadores.forEach((organizador) => {
                  organizadoresMap[organizador.id] = organizador;
                });
                return { organizadoresMaisAtivos, organizadoresMap };
              })
            );
        }),
        map(({ organizadoresMaisAtivos, organizadoresMap }) => {
          return organizadoresMaisAtivos.map((organizador) => {
            const nome = organizadoresMap[+organizador.id].nomeResponsavel;
            return { nome, quantidade: organizador.quantidade };
          });
        })
      );
  }
}
