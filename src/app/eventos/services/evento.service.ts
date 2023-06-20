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

  getOrganizadoresMaisAtivos(): Observable<
    { nome: string; quantidade: number }[]
  > {
    return this.http.get<{ nome: string; quantidade: number }[]>(
      `${environment.apiUrl}/eventos/organizadores-mais-ativos`
    );
  }
}
