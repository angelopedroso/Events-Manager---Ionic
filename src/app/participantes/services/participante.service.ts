import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParticipanteInterface } from '../types/participante.interface';

@Injectable()
export class ParticipanteService {
  constructor(private httpClient: HttpClient) {}

  getParticipante(id: number): Observable<ParticipanteInterface> {
    return this.httpClient.get<ParticipanteInterface>(
      `${environment.apiUrl}/participantes/${id}`
    );
  }

  getParticipantes(): Observable<ParticipanteInterface[]> {
    return this.httpClient.get<ParticipanteInterface[]>(
      `${environment.apiUrl}/participantes`
    );
  }

  update(
    participante: ParticipanteInterface
  ): Observable<ParticipanteInterface> {
    return this.httpClient.put<ParticipanteInterface>(
      `${environment.apiUrl}/participantes/${participante.id}`,
      participante
    );
  }

  save(participante: ParticipanteInterface): Observable<ParticipanteInterface> {
    return this.httpClient.post<ParticipanteInterface>(
      `${environment.apiUrl}/participantes`,
      participante
    );
  }

  remove(participante: ParticipanteInterface): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.apiUrl}/participantes/${participante.id}`
    );
  }
}
