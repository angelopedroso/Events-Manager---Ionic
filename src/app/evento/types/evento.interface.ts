export interface EventoInterface {
  id?: number;
  organizadorId?: number;
  participanteId?: number[];
  nome: string;
  descricao?: string;
  data: string;
  hora: string;
  endereco: string;
}
