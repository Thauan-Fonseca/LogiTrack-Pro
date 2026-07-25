import axios from "axios";
import type { ApiError } from "../types/error";

export function extrairErro(error: unknown): { mensagem: string; fieldErrors: Record<string, string> | null } {
  if (axios.isAxiosError<ApiError>(error) && error.response?.data) {
    const data = error.response.data;
    return { mensagem: data.message, fieldErrors: data.fieldErrors };
  }
  return { mensagem: "Erro inesperado ao comunicar com o servidor", fieldErrors: null };
}
