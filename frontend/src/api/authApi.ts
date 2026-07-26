import { httpClient } from "./httpClient";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const authApi = {
  login: (dto: LoginRequest) =>
    httpClient.post<LoginResponse>("/api/auth/login", dto).then((res) => res.data),
};
