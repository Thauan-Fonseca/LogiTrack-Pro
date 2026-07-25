import { httpClient } from "./httpClient";
import type { Viagem, ViagemRequest } from "../types/viagem";

export const viagensApi = {
  listar: () => httpClient.get<Viagem[]>("/api/viagens").then((res) => res.data),

  criar: (dto: ViagemRequest) =>
    httpClient.post<Viagem>("/api/viagens", dto).then((res) => res.data),

  atualizar: (id: number, dto: ViagemRequest) =>
    httpClient.put<Viagem>(`/api/viagens/${id}`, dto).then((res) => res.data),

  excluir: (id: number) => httpClient.delete<void>(`/api/viagens/${id}`).then(() => undefined),
};
