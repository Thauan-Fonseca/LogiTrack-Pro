import type { Veiculo } from "./veiculo";

export interface Viagem {
  id: number;
  veiculo: Veiculo;
  dataSaida: string;
  dataChegada: string | null;
  origem: string;
  destino: string;
  kmPercorrida: number | null;
}

export interface ViagemRequest {
  veiculoId: number;
  dataSaida: string;
  dataChegada?: string | null;
  origem: string;
  destino: string;
  kmPercorrida?: number | null;
}
