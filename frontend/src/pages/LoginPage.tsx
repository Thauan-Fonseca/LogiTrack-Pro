import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { authStorage } from "../api/authStorage";
import { extrairErro } from "../api/errorUtils";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [demorando, setDemorando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const avisoDemora = setTimeout(() => setDemorando(true), 4000);
    try {
      const { token } = await authApi.login({ username, senha });
      authStorage.setToken(token);
      const destino = (location.state as { from?: string } | null)?.from ?? "/dashboard";
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(extrairErro(err).mensagem);
    } finally {
      clearTimeout(avisoDemora);
      setDemorando(false);
      setEnviando(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card card" onSubmit={handleSubmit}>
        <div className="login-brand">LogiTrack Pro</div>
        <p className="login-subtitle">Entre para acessar o painel</p>

        {erro && <div className="error-banner">{erro}</div>}
        {!erro && demorando && (
          <div className="info-banner">
            O servidor está iniciando (plano gratuito do Render) — a primeira requisição
            pode levar até 2 minutos. Aguarde...
          </div>
        )}

        <div className="field">
          <label htmlFor="login-username">Usuário</label>
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="login-senha">Senha</label>
          <input
            id="login-senha"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary login-submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
