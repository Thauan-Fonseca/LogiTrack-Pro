import { httpClient } from "./httpClient";
import type { DashboardResponse } from "../types/dashboard";

export const dashboardApi = {
  obter: (veiculoId?: number) =>
    httpClient
      .get<DashboardResponse>("/api/dashboard", {
        params: veiculoId ? { veiculoId } : undefined,
      })
      .then((res) => res.data),
};
