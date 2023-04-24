import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrganizadorInterface } from '../types/organizador.interface';

@Injectable()
export class OrganizadorService {
  constructor(private httpClient: HttpClient) {}

  getOrganizador(id: number): Observable<OrganizadorInterface> {
    return this.httpClient.get<OrganizadorInterface>(
      `${environment.apiUrl}/organizadores/${id}`
    );
  }

  getOrganizadores(): Observable<OrganizadorInterface[]> {
    return this.httpClient.get<OrganizadorInterface[]>(
      `${environment.apiUrl}/organizadores`
    );
  }

  update(organizador: OrganizadorInterface): Observable<OrganizadorInterface> {
    return this.httpClient.put<OrganizadorInterface>(
      `${environment.apiUrl}/organizadores/${organizador.id}`,
      organizador
    );
  }

  save(organizador: OrganizadorInterface): Observable<OrganizadorInterface> {
    return this.httpClient.post<OrganizadorInterface>(
      `${environment.apiUrl}/organizadores`,
      organizador
    );
  }

  remove(organizador: OrganizadorInterface): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.apiUrl}/organizadores/${organizador.id}`
    );
  }
}
