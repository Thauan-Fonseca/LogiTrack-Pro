import { useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi";
import VeiculoSelect from "../components/VeiculoSelect";
import StatTile from "../components/dashboard/StatTile";
import VolumeCategoriaBars from "../components/dashboard/VolumeCategoriaBars";
import ProximasManutencoesTable from "../components/dashboard/ProximasManutencoesTable";
import RankingUtilizacaoTable from "../components/dashboard/RankingUtilizacaoTable";
import type { DashboardResponse } from "../types/dashboard";
import "./DashboardPage.css";

const formatoKm = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const IconeVelocimetro = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

const IconeMoeda = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M15 9.5c0-1.1-1.3-1.75-3-1.75s-3 .78-3 1.75 1.3 1.5 3 1.5 3 .6 3 1.5-1.3 1.75-3 1.75-3-.65-3-1.75" />
  </svg>
);

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardResponse | null>(null);
  const [veiculoId, setVeiculoId] = useState<number | "">("");

  useEffect(() => {
    dashboardApi.obter(veiculoId === "" ? undefined : veiculoId).then(setDados);
  }, [veiculoId]);

  if (!dados) {
    return <p className="empty-state">Carregando dashboard...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stat-row">
        <StatTile
          label="Total de KM percorrido"
          value={`${formatoKm.format(dados.kmTotal.totalKm)} km`}
          sublabel={veiculoId === "" ? "Frota inteira" : "Veículo selecionado"}
          icon={IconeVelocimetro}
          action={
            <div className="stat-tile-filter">
              <VeiculoSelect value={veiculoId} onChange={setVeiculoId} placeholderLabel="Frota inteira" />
            </div>
          }
        />
        <StatTile
          label="Projeção financeira (mês atual)"
          value={formatoMoeda.format(dados.projecaoFinanceiraMesAtual.custoTotalEstimado)}
          sublabel={`${dados.projecaoFinanceiraMesAtual.quantidadeManutencoes} manutenção(ões) no mês`}
          icon={IconeMoeda}
        />
      </div>

      <ProximasManutencoesTable dados={dados.proximasManutencoes} />

      <div className="dashboard-grid">
        <RankingUtilizacaoTable dados={dados.rankingUtilizacao} />
        <VolumeCategoriaBars dados={dados.volumePorCategoria} />
      </div>
    </div>
  );
}
