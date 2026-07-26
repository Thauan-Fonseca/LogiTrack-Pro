import { useEffect, useState } from "react";
import { viagensApi } from "../api/viagensApi";
import { extrairErro } from "../api/errorUtils";
import ViagemTable from "../components/ViagemTable";
import ViagemForm from "../components/ViagemForm";
import ConfirmDialog from "../components/ConfirmDialog";
import type { Viagem, ViagemRequest } from "../types/viagem";

export default function ViagensPage() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [viagemEmEdicao, setViagemEmEdicao] = useState<Viagem | null>(null);
  const [viagemParaExcluir, setViagemParaExcluir] = useState<Viagem | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  function carregar() {
    setCarregando(true);
    viagensApi
      .listar()
      .then(setViagens)
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  function abrirNovaViagem() {
    setViagemEmEdicao(null);
    setErro(null);
    setFieldErrors(null);
    setMostrarForm(true);
  }

  function abrirEdicao(viagem: Viagem) {
    setViagemEmEdicao(viagem);
    setErro(null);
    setFieldErrors(null);
    setMostrarForm(true);
  }

  async function salvar(dto: ViagemRequest) {
    setErro(null);
    setFieldErrors(null);
    try {
      if (viagemEmEdicao) {
        await viagensApi.atualizar(viagemEmEdicao.id, dto);
      } else {
        await viagensApi.criar(dto);
      }
      setMostrarForm(false);
      carregar();
    } catch (e) {
      const { mensagem, fieldErrors } = extrairErro(e);
      setErro(mensagem);
      setFieldErrors(fieldErrors);
    }
  }

  async function confirmarExclusao() {
    if (!viagemParaExcluir) return;
    await viagensApi.excluir(viagemParaExcluir.id);
    setViagemParaExcluir(null);
    carregar();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Viagens</h1>
        {!mostrarForm && (
          <button type="button" className="btn btn-primary" onClick={abrirNovaViagem}>
            Nova viagem
          </button>
        )}
      </div>

      {erro && <div className="error-banner">{erro}</div>}

      {mostrarForm && (
        <ViagemForm
          viagemInicial={viagemEmEdicao}
          fieldErrors={fieldErrors}
          onSubmit={salvar}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {carregando ? <p className="empty-state">Carregando...</p> : (
        <ViagemTable viagens={viagens} onEditar={abrirEdicao} onExcluir={setViagemParaExcluir} />
      )}

      <ConfirmDialog
        open={viagemParaExcluir !== null}
        title="Excluir viagem"
        message={
          viagemParaExcluir
            ? `Excluir a viagem de ${viagemParaExcluir.origem} para ${viagemParaExcluir.destino} (${viagemParaExcluir.veiculo.placa})? Essa ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        danger
        onConfirm={confirmarExclusao}
        onCancel={() => setViagemParaExcluir(null)}
      />
    </div>
  );
}
