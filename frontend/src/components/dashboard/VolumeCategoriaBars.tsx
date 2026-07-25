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
      <span className="section-label">Volume por categoria</span>
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
