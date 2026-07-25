import { useState, type FormEvent } from "react";
import VeiculoSelect from "./VeiculoSelect";
import DateTimeField from "./DateTimeField";
import type { Viagem, ViagemRequest } from "../types/viagem";
import "./ViagemForm.css";

interface ViagemFormProps {
  viagemInicial?: Viagem | null;
  fieldErrors: Record<string, string> | null;
  onSubmit: (dto: ViagemRequest) => Promise<void>;
  onCancel: () => void;
}

export default function ViagemForm({ viagemInicial, fieldErrors, onSubmit, onCancel }: ViagemFormProps) {
  const [veiculoId, setVeiculoId] = useState<number | "">(viagemInicial?.veiculo.id ?? "");
  const [dataSaida, setDataSaida] = useState(viagemInicial?.dataSaida.slice(0, 16) ?? "");
  const [dataChegada, setDataChegada] = useState(viagemInicial?.dataChegada?.slice(0, 16) ?? "");
  const [origem, setOrigem] = useState(viagemInicial?.origem ?? "");
  const [destino, setDestino] = useState(viagemInicial?.destino ?? "");
  const [kmPercorrida, setKmPercorrida] = useState(viagemInicial?.kmPercorrida?.toString() ?? "");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await onSubmit({
        veiculoId: veiculoId as number,
        dataSaida,
        dataChegada: dataChegada || null,
        origem,
        destino,
        kmPercorrida: kmPercorrida === "" ? null : Number(kmPercorrida),
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="viagem-form card" onSubmit={handleSubmit}>
      <h3>{viagemInicial ? "Editar viagem" : "Nova viagem"}</h3>

      <div className="field">
        <label>Veículo</label>
        <VeiculoSelect value={veiculoId} onChange={setVeiculoId} />
        {fieldErrors?.veiculoId && <p className="field-error">{fieldErrors.veiculoId}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label>Data/hora de saída</label>
          <DateTimeField value={dataSaida} onChange={setDataSaida} />
          {fieldErrors?.dataSaida && <p className="field-error">{fieldErrors.dataSaida}</p>}
        </div>
        <div className="field">
          <label>Data/hora de chegada (opcional)</label>
          <DateTimeField value={dataChegada} onChange={setDataChegada} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Origem</label>
          <input type="text" value={origem} onChange={(e) => setOrigem(e.target.value)} maxLength={100} />
          {fieldErrors?.origem && <p className="field-error">{fieldErrors.origem}</p>}
        </div>
        <div className="field">
          <label>Destino</label>
          <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} maxLength={100} />
          {fieldErrors?.destino && <p className="field-error">{fieldErrors.destino}</p>}
        </div>
      </div>

      <div className="field">
        <label>Quilometragem percorrida (opcional)</label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={kmPercorrida}
          onChange={(e) => setKmPercorrida(e.target.value)}
        />
        {fieldErrors?.kmPercorrida && <p className="field-error">{fieldErrors.kmPercorrida}</p>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={enviando || veiculoId === ""}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
