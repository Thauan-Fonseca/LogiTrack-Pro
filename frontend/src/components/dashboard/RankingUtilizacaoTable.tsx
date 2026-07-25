import type { RankingUtilizacao } from "../../types/dashboard";
import "./RankingUtilizacaoTable.css";

interface RankingUtilizacaoTableProps {
  dados: RankingUtilizacao[];
}

const formatoKm = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

const CORES_CATEGORICAS = [
  "var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)",
  "var(--series-5)", "var(--series-6)", "var(--series-7)", "var(--series-8)",
];

function corDoVeiculo(veiculoId: number) {
  return CORES_CATEGORICAS[veiculoId % CORES_CATEGORICAS.length];
}

export default function RankingUtilizacaoTable({ dados }: RankingUtilizacaoTableProps) {
  const max = Math.max(1, ...dados.map((d) => d.kmAcumulado));

  return (
    <div className="card">
      <span className="section-label">Ranking de utilização (km acumulado)</span>
      {dados.length === 0 ? (
        <p className="empty-state">Sem dados de utilização ainda.</p>
      ) : (
        <div className="ranking-list">
          {dados.map((d, i) => (
            <div className="ranking-row" key={d.veiculoId}>
              <span className="ranking-pos">{i + 1}º</span>
              <span className="ranking-name">{d.placa} — {d.modelo}</span>
              <div className="ranking-track">
                <div
                  className="ranking-fill"
                  style={{ width: `${(d.kmAcumulado / max) * 100}%`, background: corDoVeiculo(d.veiculoId) }}
                />
              </div>
              <span className="ranking-value">{formatoKm.format(d.kmAcumulado)} km</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
