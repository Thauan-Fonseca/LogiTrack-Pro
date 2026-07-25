import { httpClient } from "./httpClient";
import type { Veiculo } from "../types/veiculo";

export const veiculosApi = {
  listar: () => httpClient.get<Veiculo[]>("/api/veiculos").then((res) => res.data),
};
