import type { VolumeCategoria } from "../../types/dashboard";
import "./VolumeCategoriaBars.css";

interface VolumeCategoriaBarsProps {
  dados: VolumeCategoria[];
}

const CORES: Record<string, string> = {
  LEVE: "var(--series-1)",
  PESADO: "var(--series-2)",
};

export default function VolumeCategoriaBars({ dados }: VolumeCategoriaBarsProps) {
  const max = Math.max(1, ...dados.map((d) => d.quantidadeViagens));

  return (
    <div className="card">
      <span className="section-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Volume por categoria
      </span>
      <div className="volume-bars">
        {dados.map((d) => (
          <div className="volume-bar-row" key={d.categoria}>
            <span className="volume-bar-name">{d.categoria}</span>
            <div className="volume-bar-track">
              <div
                className="volume-bar-fill"
                style={{
                  width: `${(d.quantidadeViagens / max) * 100}%`,
                  background: CORES[d.categoria] ?? "var(--series-1)",
                }}
              />
            </div>
            <span className="volume-bar-value">{d.quantidadeViagens}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
