import type { Viagem } from "../types/viagem";
import "./ViagemTable.css";

interface ViagemTableProps {
  viagens: Viagem[];
  onEditar: (viagem: Viagem) => void;
  onExcluir: (viagem: Viagem) => void;
}

const formatoData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
const formatoKm = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ViagemTable({ viagens, onEditar, onExcluir }: ViagemTableProps) {
  if (viagens.length === 0) {
    return <p className="empty-state">Nenhuma viagem cadastrada ainda.</p>;
  }

  return (
    <div className="card table-wrap">
      <table className="viagem-table">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Saída</th>
            <th>Chegada</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Km</th>
            <th aria-label="Ações"></th>
          </tr>
        </thead>
        <tbody>
          {viagens.map((viagem) => (
            <tr key={viagem.id}>
              <td>{viagem.veiculo.placa} — {viagem.veiculo.modelo}</td>
              <td>{formatoData.format(new Date(viagem.dataSaida))}</td>
              <td>{viagem.dataChegada ? formatoData.format(new Date(viagem.dataChegada)) : "—"}</td>
              <td>{viagem.origem}</td>
              <td>{viagem.destino}</td>
              <td className="num">{viagem.kmPercorrida != null ? formatoKm.format(viagem.kmPercorrida) : "—"}</td>
              <td className="actions">
                <button type="button" className="btn" onClick={() => onEditar(viagem)}>
                  Editar
                </button>
                <button type="button" className="btn btn-danger" onClick={() => onExcluir(viagem)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
