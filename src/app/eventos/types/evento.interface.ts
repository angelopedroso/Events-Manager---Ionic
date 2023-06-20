import { OrganizadorInterface } from 'src/app/organizadores/types/organizador.interface';

export interface EventoInterface {
  id: number;
  organizador: OrganizadorInterface;
  participantes: { id: string }[];
  nome: string;
  descricao?: string;
  data: string;
  hora: string;
  endereco: string;
}
