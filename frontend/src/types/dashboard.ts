export interface KmTotal {
  totalKm: number;
  veiculoId: number | null;
}

export interface VolumeCategoria {
  categoria: string;
  quantidadeViagens: number;
}

export interface ProximaManutencao {
  id: number;
  veiculoId: number;
  placa: string;
  modelo: string;
  dataInicio: string;
  tipoServico: string;
  custoEstimado: number;
  status: string;
}

export interface RankingUtilizacao {
  veiculoId: number;
  placa: string;
  modelo: string;
  kmAcumulado: number;
}

export interface ProjecaoFinanceira {
  custoTotalEstimado: number;
  quantidadeManutencoes: number;
}

export interface DashboardResponse {
  kmTotal: KmTotal;
  volumePorCategoria: VolumeCategoria[];
  proximasManutencoes: ProximaManutencao[];
  rankingUtilizacao: RankingUtilizacao[];
  projecaoFinanceiraMesAtual: ProjecaoFinanceira;
}
