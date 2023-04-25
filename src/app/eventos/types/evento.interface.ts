export interface EventoInterface {
  id?: number;
  organizadorId: number;
  participantes: {participanteId: number}[];
  nome: string;
  descricao?: string;
  data: string;
  hora: string;
  endereco: string;
}
