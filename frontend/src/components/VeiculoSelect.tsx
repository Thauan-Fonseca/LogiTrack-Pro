import { useEffect, useState } from "react";
import { veiculosApi } from "../api/veiculosApi";
import type { Veiculo } from "../types/veiculo";

interface VeiculoSelectProps {
  value: number | "";
  onChange: (veiculoId: number | "") => void;
  placeholderLabel?: string;
  disabled?: boolean;
}

export default function VeiculoSelect({ value, onChange, placeholderLabel = "Selecione um veículo", disabled }: VeiculoSelectProps) {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    veiculosApi.listar().then(setVeiculos);
  }, []);

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
    >
      <option value="">{placeholderLabel}</option>
      {veiculos.map((veiculo) => (
        <option key={veiculo.id} value={veiculo.id}>
          {veiculo.placa} — {veiculo.modelo}
        </option>
      ))}
    </select>
  );
}
