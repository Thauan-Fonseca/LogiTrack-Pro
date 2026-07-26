import type { ProximaManutencao } from "../../types/dashboard";
import "./ProximasManutencoesTable.css";

interface ProximasManutencoesTableProps {
  dados: ProximaManutencao[];
}

const formatoData = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" });
const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  EM_REALIZACAO: "Em realização",
  CONCLUIDA: "Concluída",
};

export default function ProximasManutencoesTable({ dados }: ProximasManutencoesTableProps) {
  return (
    <div className="card proximas-card">
      <span className="section-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94Z" />
        </svg>
        Próximas manutenções
      </span>
      {dados.length === 0 ? (
        <p className="empty-state">Nenhuma manutenção agendada.</p>
      ) : (
        <div className="table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Serviço</th>
                <th>Data</th>
                <th>Custo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((m) => (
                <tr key={m.id}>
                  <td>{m.placa} — {m.modelo}</td>
                  <td>{m.tipoServico}</td>
                  <td>{formatoData.format(new Date(m.dataInicio))}</td>
                  <td className="num">{formatoMoeda.format(m.custoEstimado)}</td>
                  <td>
                    <span className={`status-pill status-${m.status.toLowerCase()}`}>
                      {STATUS_LABEL[m.status] ?? m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
