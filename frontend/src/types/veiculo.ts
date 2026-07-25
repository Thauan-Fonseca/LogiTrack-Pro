export type TipoVeiculo = "LEVE" | "PESADO";

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  tipo: TipoVeiculo;
  ano: number;
}
