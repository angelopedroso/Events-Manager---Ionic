export interface ParticipanteInterface {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  genero: 'Masculino' | 'Feminino';
}
